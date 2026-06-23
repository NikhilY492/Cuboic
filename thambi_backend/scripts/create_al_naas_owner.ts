import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const restaurantName = 'Al Naas';
  const ownerUserId = 'alnaas_owner';
  const password = 'alnaas123';

  console.log(`🚀 Creating Restaurant: ${restaurantName}...`);

  // 1. Create Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      name: restaurantName,
      description: 'Authentic Arabian Dining',
      paymentStrategy: 'PayPerOrder',
    },
  });

  console.log(`✅ Restaurant Created: ${restaurant.id}`);

  // 2. Create Outlet
  const outlet = await prisma.outlet.create({
    data: {
      name: `${restaurantName} Main`,
      restaurantId: restaurant.id,
      address: 'Main Street, Food City',
    },
  });

  console.log(`✅ Outlet Created: ${outlet.id}`);

  // 3. Create Owner User
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name: `${restaurantName} Owner`,
      user_id: ownerUserId,
      password_hash: hashedPassword,
      role: 'Owner',
      restaurantId: restaurant.id,
      outletId: outlet.id,
    },
  });

  console.log(`✅ Owner User Created: ${user.user_id}`);
  console.log(`🔑 Password: ${password}`);

  // 4. Create 10 Tables
  console.log(`🪑 Creating 10 tables...`);
  const tablePromises: any[] = [];
  for (let i = 1; i <= 10; i++) {
    tablePromises.push(
      prisma.table.create({
        data: {
          table_number: `${i}`,
          restaurantId: restaurant.id,
        },
      })
    );
  }
  await Promise.all(tablePromises);

  console.log(`✅ 10 Tables Created!`);
  console.log(`\n--- Summary ---`);
  console.log(`Restaurant ID: ${restaurant.id}`);
  console.log(`Owner User ID: ${user.user_id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error creating restaurant:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
