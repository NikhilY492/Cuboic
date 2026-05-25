import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Find the existing Al Naas restaurant
  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Al Naas' },
  });

  if (!restaurant) {
    console.error('❌ Al Naas restaurant not found in the database!');
    process.exit(1);
  }

  console.log(`✅ Found Al Naas restaurant: ${restaurant.id}`);

  // New tables to add
  const newTables = [
    'Table 11',
    'Table 12',
    'Table F1',
    'Table F2',
    'Table F3',
    'Majilis',
    'PDR',
  ];

  console.log(`🪑 Adding ${newTables.length} new tables...`);

  for (const tableNumber of newTables) {
    const created = await prisma.table.create({
      data: {
        table_number: tableNumber,
        restaurantId: restaurant.id,
        is_active: true,
      },
    });
    console.log(`  ✅ Created: "${created.table_number}" (ID: ${created.id})`);
  }

  console.log(`\n🎉 Done! ${newTables.length} tables added to Al Naas.`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
