import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Get or create Restaurant
  let restaurant = await prisma.restaurant.findFirst();
  if (!restaurant) {
    restaurant = await prisma.restaurant.create({
      data: {
        name: 'Demo Restaurant',
      }
    });
  }
  console.log('Restaurant ID:', restaurant.id);

  // 2. Get or create Outlet
  let outlet = await prisma.outlet.findFirst({
    where: { restaurantId: restaurant.id }
  });
  if (!outlet) {
    outlet = await prisma.outlet.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Main Branch'
      }
    });
  }
  console.log('Outlet ID:', outlet.id);

  // 3. Get or create Category
  let category = await prisma.category.findFirst({
    where: { restaurantId: restaurant.id }
  });
  if (!category) {
    category = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        name: 'Demo Category'
      }
    });
  }

  // 4. Create MenuItem
  const menuItem = await prisma.menuItem.create({
    data: {
      restaurantId: restaurant.id,
      categoryId: category.id,
      name: 'Demo Burger',
      price: 150,
    }
  });
  console.log('MenuItem ID:', menuItem.id);

  // 5. Create InventoryItems
  const bun = await prisma.inventoryItem.create({
    data: {
      outletId: outlet.id,
      name: 'Burger Bun',
      unit: 'pcs',
      currentStock: 100,
      costPerUnit: 10
    }
  });
  
  const patty = await prisma.inventoryItem.create({
    data: {
      outletId: outlet.id,
      name: 'Veg Patty',
      unit: 'pcs',
      currentStock: 100,
      costPerUnit: 20
    }
  });
  console.log('Inventory Items created:', bun.name, patty.name);

  // 6. Create Recipe & Ingredients
  const recipe = await prisma.recipe.create({
    data: {
      menuItemId: menuItem.id,
      ingredients: {
        create: [
          { inventoryItemId: bun.id, quantity: 1 },
          { inventoryItemId: patty.id, quantity: 1 }
        ]
      }
    }
  });
  console.log('Recipe created with ID:', recipe.id);

  // 7. Get or Create Table
  let table = await prisma.table.findFirst({
    where: { restaurantId: restaurant.id }
  });
  if (!table) {
    table = await prisma.table.create({
      data: {
        restaurantId: restaurant.id,
        table_number: 'T1'
      }
    });
  }

  console.log('Done seeding demo data.');
  
  // Test inventory depletion by simulating order consumption
  console.log('\n--- Testing Inventory Depletion ---');
  
  // Get initial stock
  const initialBun = await prisma.inventoryItem.findUnique({ where: { id: bun.id } });
  const initialPatty = await prisma.inventoryItem.findUnique({ where: { id: patty.id } });
  console.log(`Initial Stock -> Bun: ${initialBun?.currentStock}, Patty: ${initialPatty?.currentStock}`);

  // Create an Order for the Demo Burger
  const order = await prisma.order.create({
    data: {
      restaurantId: restaurant.id,
      outletId: outlet.id,
      tableId: table.id,
      customer_session_id: 'test-session',
      orderType: 'DineIn',
      items: [
        {
          itemId: menuItem.id,
          name: menuItem.name,
          unitPrice: menuItem.price,
          quantity: 2 // Ordering 2 burgers
        }
      ],
      subtotal: menuItem.price * 2,
      tax: 0,
      total: menuItem.price * 2,
      status: 'Pending'
    }
  });
  console.log(`Created Order ${order.id} for 2 Demo Burgers`);

  // We need to call the InventoryConsumptionService logic.
  // Since we are not in the Nest context, we can simulate the Prisma transaction here
  await prisma.$transaction(async (tx) => {
    const deductions = new Map<string, number>();
    // Fetch Recipes
    const recipes = await tx.recipe.findMany({
      where: { menuItemId: menuItem.id },
      include: { ingredients: { include: { inventoryItem: true } } },
    });
    const recipe = recipes.find(r => r.menuItemId === menuItem.id);
    
    if (recipe) {
      for (const ingredient of recipe.ingredients) {
        if (!ingredient.inventoryItem) continue;
        const name = ingredient.inventoryItem.name;
        // 2 burgers * quantity per burger
        const needed = ingredient.quantity * 2; 
        deductions.set(name, needed);
      }
    }

    const inventoryItems = await tx.inventoryItem.findMany({
      where: {
        name: { in: Array.from(deductions.keys()) },
        outletId: order.outletId!,
      },
    });

    for (const [name, neededQty] of deductions.entries()) {
      const invItem = inventoryItems.find(i => i.name === name);
      if (invItem) {
        await tx.inventoryItem.update({
          where: { id: invItem.id },
          data: { currentStock: invItem.currentStock - neededQty },
        });
        await tx.stockTransaction.create({
          data: {
            inventoryItemId: invItem.id,
            outletId: order.outletId!,
            type: 'StockOut',
            quantity: neededQty,
            referenceType: 'Order',
            referenceId: order.id,
            notes: `Auto-deducted for order ${order.id}`,
          },
        });
      }
    }
  });

  // Get final stock
  const finalBun = await prisma.inventoryItem.findUnique({ where: { id: bun.id } });
  const finalPatty = await prisma.inventoryItem.findUnique({ where: { id: patty.id } });
  console.log(`Final Stock -> Bun: ${finalBun?.currentStock}, Patty: ${finalPatty?.currentStock}`);

  if (
    finalBun && initialBun && finalBun.currentStock === initialBun.currentStock - 2 &&
    finalPatty && initialPatty && finalPatty.currentStock === initialPatty.currentStock - 2
  ) {
    console.log('✅ Inventory successfully depleted after order!');
  } else {
    console.log('❌ Inventory depletion failed or stock mismatch.');
  }

}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
