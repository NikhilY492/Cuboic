import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const restaurant = await prisma.restaurant.findFirst({
    where: { name: 'Al Naas' },
    include: { tables: { orderBy: { createdAt: 'asc' } } },
  });

  if (!restaurant) {
    console.log('❌ Restaurant not found');
    return;
  }

  console.log(`\n=== AL NAAS TABLE LINKS ===`);
  console.log(`Restaurant ID: ${restaurant.id}\n`);

  for (const t of restaurant.tables) {
    console.log(`[${t.table_number}]`);
    console.log(`https://thambi.vercel.app/?r=${restaurant.id}&t=${t.id}\n`);
  }
}

main().finally(() => prisma.$disconnect());
