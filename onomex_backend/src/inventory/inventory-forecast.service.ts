import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ProjectedStockPoint {
  day: number;
  date: string;
  projectedStock: number;
  reorderPoint: number;
}

export interface InventoryItemPrediction {
  id: string;
  name: string;
  unit: string;
  category: string;
  currentStock: number;
  reorderLevel: number;
  leadTimeDays: number;
  costPerUnit: number;
  avgDailyUse: number;
  demandStd: number;
  safetyStock: number;
  dynamicReorderPoint: number;
  daysUntilStockout: number;
  daysUntilReorder: number;
  urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY';
  projectedStockoutDate: string | null;
  reorderDeadlineDate: string | null;
  projectedDepletion: ProjectedStockPoint[];
}

export interface InventoryForecastSummary {
  outletId: string;
  generatedAt: string;
  totalItems: number;
  criticalCount: number;
  warningCount: number;
  healthyCount: number;
  items: InventoryItemPrediction[];
}

@Injectable()
export class InventoryForecastService {
  private readonly logger = new Logger(InventoryForecastService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getForecast(outletId: string, historyDays = 60): Promise<InventoryForecastSummary> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - historyDays);
    startDate.setHours(0, 0, 0, 0);

    // 1. Fetch all Inventory Items for this outlet
    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: { outletId },
      orderBy: { name: 'asc' },
    });

    if (inventoryItems.length === 0) {
      return {
        outletId,
        generatedAt: new Date().toISOString(),
        totalItems: 0,
        criticalCount: 0,
        warningCount: 0,
        healthyCount: 0,
        items: [],
      };
    }

    // 2. Fetch all completed / non-cancelled orders in the history window
    const orders = await this.prisma.order.findMany({
      where: {
        outletId,
        status: { not: 'Cancelled' },
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        items: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // 3. Fetch all Recipes with Ingredients
    const recipes = await this.prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            inventoryItem: true,
          },
        },
      },
    });

    // Map: menuItemId -> [{ inventoryItemId, quantity }]
    const recipeMap = new Map<string, { inventoryItemId: string; quantity: number }[]>();
    for (const r of recipes) {
      recipeMap.set(
        r.menuItemId,
        r.ingredients.map((ing) => ({
          inventoryItemId: ing.inventoryItemId,
          quantity: ing.quantity,
        })),
      );
    }

    // 4. Aggregate daily usage per inventory item: itemId -> Map<dateStr, totalUsed>
    const itemDailyUsage = new Map<string, Map<string, number>>();
    for (const item of inventoryItems) {
      itemDailyUsage.set(item.id, new Map<string, number>());
    }

    const uniqueDates = new Set<string>();

    for (const order of orders) {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      uniqueDates.add(dateStr);

      const items = (order.items as any[]) || [];
      for (const orderItem of items) {
        const itemId = orderItem.item_id || orderItem.itemId;
        const qty = Number(orderItem.quantity) || 1;
        const ingredients = recipeMap.get(itemId);

        if (ingredients) {
          for (const ing of ingredients) {
            const usageMap = itemDailyUsage.get(ing.inventoryItemId);
            if (usageMap) {
              const current = usageMap.get(dateStr) || 0;
              usageMap.set(dateStr, current + ing.quantity * qty);
            }
          }
        }
      }
    }

    const totalTrackedDays = Math.max(uniqueDates.size, 1);
    const serviceZ = 1.65; // 95% service level buffer

    // 5. Compute metrics & depletion projections
    const now = new Date();
    const predictions: InventoryItemPrediction[] = inventoryItems.map((item) => {
      const usageMap = itemDailyUsage.get(item.id) || new Map<string, number>();
      const usages = Array.from(usageMap.values());

      const totalUsed = usages.reduce((sum, u) => sum + u, 0);
      const avgDailyUse = totalUsed / totalTrackedDays;

      let variance = 0;
      if (totalTrackedDays > 1) {
        const sumSq = usages.reduce((sum, u) => sum + Math.pow(u - avgDailyUse, 2), 0);
        const zeroDays = totalTrackedDays - usages.length;
        const zeroSq = zeroDays * Math.pow(0 - avgDailyUse, 2);
        variance = (sumSq + zeroSq) / (totalTrackedDays - 1);
      }
      const demandStd = Math.sqrt(Math.max(0, variance));

      const leadTime = (item as any).leadTimeDays ?? 2;
      const safetyStock = serviceZ * demandStd * Math.sqrt(leadTime);
      const dynamicReorderPoint = avgDailyUse * leadTime + safetyStock;

      const daysUntilStockout = avgDailyUse > 0 ? item.currentStock / avgDailyUse : 999;
      const daysUntilReorder =
        avgDailyUse > 0 ? Math.max(0, (item.currentStock - dynamicReorderPoint) / avgDailyUse) : 999;

      let urgency: 'CRITICAL' | 'WARNING' | 'HEALTHY' = 'HEALTHY';
      if (item.currentStock <= dynamicReorderPoint || daysUntilReorder <= 1) {
        urgency = 'CRITICAL';
      } else if (daysUntilReorder <= 3) {
        urgency = 'WARNING';
      }

      let projectedStockoutDate: string | null = null;
      let reorderDeadlineDate: string | null = null;

      if (avgDailyUse > 0 && daysUntilStockout < 365) {
        const outDate = new Date(now);
        outDate.setDate(outDate.getDate() + Math.round(daysUntilStockout));
        projectedStockoutDate = outDate.toISOString().split('T')[0];
      }

      if (avgDailyUse > 0 && daysUntilReorder < 365) {
        const reorderDate = new Date(now);
        reorderDate.setDate(reorderDate.getDate() + Math.round(daysUntilReorder));
        reorderDeadlineDate = reorderDate.toISOString().split('T')[0];
      }

      // 14-day stock projection curve
      const projectedDepletion: ProjectedStockPoint[] = [];
      for (let day = 0; day <= 14; day++) {
        const d = new Date(now);
        d.setDate(d.getDate() + day);
        const projectedStock = Math.max(0, item.currentStock - avgDailyUse * day);
        projectedDepletion.push({
          day,
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          projectedStock: Number(projectedStock.toFixed(2)),
          reorderPoint: Number(dynamicReorderPoint.toFixed(2)),
        });
      }

      return {
        id: item.id,
        name: item.name,
        unit: item.unit,
        category: item.category,
        currentStock: Number(item.currentStock.toFixed(2)),
        reorderLevel: Number(item.reorderLevel.toFixed(2)),
        leadTimeDays: leadTime,
        costPerUnit: Number(item.costPerUnit.toFixed(2)),
        avgDailyUse: Number(avgDailyUse.toFixed(3)),
        demandStd: Number(demandStd.toFixed(3)),
        safetyStock: Number(safetyStock.toFixed(2)),
        dynamicReorderPoint: Number(dynamicReorderPoint.toFixed(2)),
        daysUntilStockout: Number(daysUntilStockout.toFixed(1)),
        daysUntilReorder: Number(daysUntilReorder.toFixed(1)),
        urgency,
        projectedStockoutDate,
        reorderDeadlineDate,
        projectedDepletion,
      };
    });

    predictions.sort((a, b) => {
      const score = (p: InventoryItemPrediction) =>
        p.urgency === 'CRITICAL' ? 0 : p.urgency === 'WARNING' ? 1 : 2;
      if (score(a) !== score(b)) return score(a) - score(b);
      return a.daysUntilReorder - b.daysUntilReorder;
    });

    const criticalCount = predictions.filter((p) => p.urgency === 'CRITICAL').length;
    const warningCount = predictions.filter((p) => p.urgency === 'WARNING').length;
    const healthyCount = predictions.filter((p) => p.urgency === 'HEALTHY').length;

    return {
      outletId,
      generatedAt: now.toISOString(),
      totalItems: predictions.length,
      criticalCount,
      warningCount,
      healthyCount,
      items: predictions,
    };
  }
}
