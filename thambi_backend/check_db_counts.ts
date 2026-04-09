import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const counts = {
      restaurants: await prisma.restaurant.count(),
      outlets: await prisma.outlet.count(),
      categories: await prisma.category.count(),
      menuItems: await prisma.menuItem.count(),
      users: await prisma.user.count(),
      tables: await prisma.table.count(),
      orders: await prisma.order.count(),
    };
    console.log('--- Database Counts ---');
    console.log(JSON.stringify(counts, null, 2));
    
    if (counts.restaurants > 0) {
        const foodGuru = await prisma.restaurant.findFirst({ where: { name: { contains: 'Food Guru', mode: 'insensitive' } } });
        console.log('\n--- Food Guru Check ---');
        console.log(foodGuru ? `Found: ${foodGuru.name} (${foodGuru.id})` : 'NOT FOUND');
    }
  } catch (error) {
    console.error('Error checking counts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
