import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const restaurants = await prisma.restaurant.findMany({
    where: {
      name: {
        contains: 'al',
        mode: 'insensitive'
      }
    }
  });

  const alNaas = restaurants.find(r => r.name.toLowerCase().includes('naas'));
  if (!alNaas) {
    console.log("Could not find Al Naas restaurant.");
    return;
  }

  const restaurantId = alNaas.id;
  console.log(`Found Al Naas restaurant with ID: ${restaurantId}`);

  console.log("Removing all image URLs from menu items...");
  
  const result = await prisma.menuItem.updateMany({
    where: { restaurantId },
    data: { image_url: null }
  });

  console.log(`Successfully removed images from ${result.count} menu items.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
