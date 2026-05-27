import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageCache = new Map<string, string | null>();

async function fetchWikiImage(query: string): Promise<string | null> {
  if (imageCache.has(query)) {
    return imageCache.get(query) || null;
  }

  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&pithumbsize=800`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const imageUrl = pages[pageId]?.thumbnail?.source;
      
      if (imageUrl) {
        imageCache.set(query, imageUrl);
        return imageUrl;
      }
    }
  } catch (err) {
    console.error(`Error fetching image for ${query}:`, err);
  }
  
  imageCache.set(query, null);
  return null;
}

// Map highly specific words to generic terms that Wikipedia understands
function getSearchTerm(baseName: string, categoryName: string): string {
  const genericMap: Record<string, string> = {
    "SHAWAI": "Roast Chicken",
    "MADFOON": "Mandi Food",
    "SHUWA": "Roast Chicken",
    "AL FAHAM": "Grilled Chicken",
    "JALLIKATT": "Beef Steak",
    "MADHOOTH": "Mandi Food",
    "TAWAH": "Beef Curry",
    "FALOODA": "Falooda",
    "KUBOOS": "Pita Bread",
    "ROMALI ROTTI": "Rumali Roti",
    "TENDER": "Milkshake",
    "MOJITO": "Mojito Drink",
    "LIME": "Lime Juice",
  };

  for (const [key, val] of Object.entries(genericMap)) {
    if (baseName.toUpperCase().includes(key) || categoryName.toUpperCase().includes(key)) {
      return val;
    }
  }
  
  return baseName;
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

  const items = await prisma.menuItem.findMany({
    where: { restaurantId },
    include: { category: true }
  });

  console.log(`Found ${items.length} menu items. Fetching images...`);

  let updatedCount = 0;

  for (const item of items) {
    // Extract base name (remove "- Quarter", "- Half", etc)
    const baseName = item.name.replace(/ - (Quarter|Half|Full|Small|Large)$/i, '').trim();
    
    // Determine what to search for
    const searchTerm = getSearchTerm(baseName, item.category.name);
    
    let imageUrl = await fetchWikiImage(searchTerm);
    
    // Fallback to category search if specific search fails
    if (!imageUrl) {
      imageUrl = await fetchWikiImage(item.category.name + ' Food');
    }
    
    // Fallback to generic restaurant food
    if (!imageUrl) {
      imageUrl = await fetchWikiImage('Restaurant Food');
    }

    if (imageUrl) {
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { image_url: imageUrl }
      });
      updatedCount++;
      console.log(`Updated ${item.name} with image: ${imageUrl}`);
    } else {
      console.log(`Could not find image for ${item.name}`);
    }
    
    // Small delay to be polite to Wikipedia API
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`Finished updating ${updatedCount} items with images.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
