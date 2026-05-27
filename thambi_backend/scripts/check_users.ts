import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: { name: { contains: 'al', mode: 'insensitive' } }
  });

  const alNaas = restaurants.find(r => r.name.toLowerCase().includes('naas'));
  if (!alNaas) {
    console.log("Could not find Al Naas restaurant.");
    return;
  }

  const users = await prisma.user.findMany({
    where: { restaurantId: alNaas.id }
  });

  console.log("Users for Al Naas:");
  for (const u of users) {
    console.log(`- ID: ${u.id}, Name: ${u.name}, User ID: '${u.user_id}', Role: ${u.role}, Active: ${u.is_active}`);
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
