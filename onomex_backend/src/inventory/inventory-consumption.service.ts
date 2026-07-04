import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class InventoryConsumptionService {
  private readonly logger = new Logger(InventoryConsumptionService.name);

  // Configurable flag for negative stock (defaults to true)
  private readonly ALLOW_NEGATIVE_STOCK =
    process.env.ALLOW_NEGATIVE_STOCK !== 'false';

  async consumeOrderInventory(
    orderId: string,
    tx: Prisma.TransactionClient,
  ): Promise<void> {
    // 1. Fetch Order and Items
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        outlet: true,
      },
    });

    if (!order) {
      throw new BadRequestException(`Order ${orderId} not found`);
    }

    if (!order.outletId) {
      this.logger.warn(
        `Order ${orderId} has no outletId. Skipping inventory deduction.`,
      );
      return;
    }

    // items is stored as Json in DB: [{itemId, name, unitPrice, quantity}]
    const items = (order.items as any[]) || [];
    if (items.length === 0) return;

    // 2. Fetch Recipes and Ingredients
    const recipes = await tx.recipe.findMany({
      where: { menuItemId: { in: items.map((i) => i.itemId) } },
      include: { ingredients: { include: { inventoryItem: true } } },
    });

    // Handle missing recipes
    const itemIdsWithRecipes = new Set(recipes.map((r) => r.menuItemId));
    for (const item of items) {
      if (!itemIdsWithRecipes.has(item.itemId)) {
        this.logger.warn(
          `Menu item ${item.name} (${item.itemId}) has no recipe configured.`,
        );

        // Audit warning for missing recipe
        await tx.auditLog.create({
          data: {
            restaurantId: order.restaurantId,
            userId: order.customerId || 'SYSTEM', // Fallback to SYSTEM if no customer
            action: 'INVENTORY_MISSING_RECIPE',
            details: {
              orderId,
              menuItemId: item.itemId,
              menuItemName: item.name,
              message: 'Menu item has no recipe configured',
            },
          },
        });
      }
    }

    // 3. Calculate Required Deductions
    const deductions = new Map<string, number>();
    for (const orderItem of items) {
      const recipe = recipes.find((r) => r.menuItemId === orderItem.itemId);
      if (!recipe) continue;

      for (const ingredient of recipe.ingredients) {
        if (!ingredient.inventoryItem) continue;
        const name = ingredient.inventoryItem.name;
        const needed = ingredient.quantity * orderItem.quantity;
        const current = deductions.get(name) || 0;
        deductions.set(name, current + needed);
      }
    }

    if (deductions.size === 0) return;

    // 4. Fetch Current Inventory Items for this specific outlet
    const inventoryItems = await tx.inventoryItem.findMany({
      where: {
        name: { in: Array.from(deductions.keys()) },
        outletId: order.outletId,
      },
    });

    const inventoryItemMap = new Map(inventoryItems.map((i) => [i.name, i]));

    for (const [name, neededQty] of deductions.entries()) {
      const invItem = inventoryItemMap.get(name);
      if (!invItem) {
        throw new BadRequestException(
          `Inventory item ${name} not found in outlet ${order.outletId}`,
        );
      }

      // Check negative stock preference
      if (!this.ALLOW_NEGATIVE_STOCK) {
        if (invItem.currentStock < neededQty) {
          throw new BadRequestException(
            `Insufficient stock for ${invItem.name}. Required: ${neededQty}, Available: ${invItem.currentStock}`,
          );
        }
      }

      const newStock = invItem.currentStock - neededQty;
      const inventoryItemId = invItem.id;

      // 5. Update InventoryItem
      await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { currentStock: newStock },
      });

      // 6. Create StockTransaction
      await tx.stockTransaction.create({
        data: {
          inventoryItemId,
          outletId: order.outletId,
          type: 'StockOut',
          quantity: neededQty,
          referenceType: 'Order',
          referenceId: orderId,
          notes: `Auto-deducted for order ${orderId}`,
        },
      });

      // 7. Audit Logging
      await tx.auditLog.create({
        data: {
          restaurantId: order.restaurantId,
          userId: order.customerId || 'SYSTEM',
          action: 'INVENTORY_AUTO_DEDUCTION',
          details: {
            orderId,
            inventoryItemId,
            quantityDeducted: neededQty,
            outletId: order.outletId,
          },
        },
      });

      // 8. Low Stock Detection
      if (newStock <= invItem.reorderLevel) {
        await tx.systemAlert.create({
          data: {
            severity: 'WARNING',
            source: 'InventoryConsumptionService',
            message: `Low stock alert for ${invItem.name}`,
            restaurantId: order.restaurantId,
            details: {
              type: 'LOW_STOCK',
              inventoryItemId,
              inventoryItemName: invItem.name,
              outletId: order.outletId,
              currentStock: newStock,
              reorderLevel: invItem.reorderLevel,
            },
          },
        });
      }
    }
  }
}
