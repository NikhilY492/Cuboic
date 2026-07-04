import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/(?:^|[\s-])\w/g, function(match) {
    return match.toUpperCase();
  });
}

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

  console.log("Capitalizing categories...");
  const categories = await prisma.category.findMany({ where: { restaurantId } });
  let catUpdated = 0;
  for (const cat of categories) {
    const newName = toTitleCase(cat.name);
    if (newName !== cat.name) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { name: newName }
      });
      catUpdated++;
    }
  }

  console.log("Capitalizing menu items...");
  const items = await prisma.menuItem.findMany({ where: { restaurantId } });
  let itemUpdated = 0;
  for (const item of items) {
    // Specifically handle BBQ if it gets converted to Bbq
    let newName = toTitleCase(item.name);
    newName = newName.replace(/Bbq/g, 'BBQ');
    
    if (newName !== item.name) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { name: newName }
      });
      itemUpdated++;
    }
  }

  console.log(`Successfully capitalized ${catUpdated} categories and ${itemUpdated} menu items.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
