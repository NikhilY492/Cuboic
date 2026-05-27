import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const menuData = [
  {
    category: "CHICKEN MANDI",
    items: [
      { name: "Chicken Mandi - Quarter", price: 200 },
      { name: "Chicken Mandi - Half", price: 390 },
      { name: "Chicken Mandi - Full", price: 770 },
      { name: "Chicken Mandi Piece - Quarter", price: 135 },
      { name: "Chicken Mandi Piece - Half", price: 260 },
      { name: "Chicken Mandi Piece - Full", price: 505 },
    ]
  },
  {
    category: "CHICKEN SHAWAI",
    items: [
      { name: "Shawai Mandi - Quarter", price: 220 },
      { name: "Shawai Mandi - Half", price: 420 },
      { name: "Shawai Mandi - Full", price: 820 },
      { name: "Shawai Piece - Quarter", price: 135 },
      { name: "Shawai Piece - Half", price: 260 },
      { name: "Shawai Piece - Full", price: 505 },
      { name: "Masala Shawai Mandi - Quarter", price: 230 },
      { name: "Masala Shawai Mandi - Half", price: 440 },
      { name: "Masala Shawai Mandi - Full", price: 840 },
      { name: "Masala Shawai Piece - Quarter", price: 150 },
      { name: "Masala Shawai Piece - Half", price: 285 },
      { name: "Masala Shawai Piece - Full", price: 550 },
    ]
  },
  {
    category: "CHICKEN SHUWAI",
    items: [
      { name: "Chicken Shuwa Mandi - Quarter", price: 260 },
      { name: "Chicken Shuwa Mandi - Half", price: 505 },
      { name: "Chicken Shuwa Mandi - Full", price: 945 },
      { name: "Chicken Shuwa Piece - Quarter", price: 180 },
      { name: "Chicken Shuwa Piece - Half", price: 335 },
      { name: "Chicken Shuwa Piece - Full", price: 630 },
    ]
  },
  {
    category: "CHICKEN MADFOON",
    items: [
      { name: "CHICKEN MADFOON - Quarter", price: 260 },
      { name: "CHICKEN MADFOON - Half", price: 505 },
      { name: "CHICKEN MADFOON - Full", price: 945 },
      { name: "CHICKEN MADFOON PIECE - Quarter", price: 180 },
      { name: "CHICKEN MADFOON PIECE - Half", price: 335 },
      { name: "CHICKEN MADFOON PIECE - Full", price: 630 },
    ]
  },
  {
    category: "AL FAHAM",
    items: [
      { name: "NORMAL AL FAHAM - Quarter", price: 150 },
      { name: "NORMAL AL FAHAM - Half", price: 290 },
      { name: "NORMAL AL FAHAM - Full", price: 545 },
      { name: "PERI - PERI AL FAHAM - Quarter", price: 160 },
      { name: "PERI - PERI AL FAHAM - Half", price: 295 },
      { name: "PERI - PERI AL FAHAM - Full", price: 570 },
      { name: "SMOKEY AL FAHAM - Quarter", price: 160 },
      { name: "SMOKEY AL FAHAM - Half", price: 295 },
      { name: "SMOKEY AL FAHAM - Full", price: 570 },
      { name: "JAMAICAN AL FAHAM - Quarter", price: 160 },
      { name: "JAMAICAN AL FAHAM - Half", price: 295 },
      { name: "JAMAICAN AL FAHAM - Full", price: 570 },
      { name: "BBQ AL FAHAM - Quarter", price: 160 },
      { name: "BBQ AL FAHAM - Half", price: 295 },
      { name: "BBQ AL FAHAM - Full", price: 570 },
      { name: "MEXICAN AL FAHAM - Quarter", price: 160 },
      { name: "MEXICAN AL FAHAM - Half", price: 295 },
      { name: "MEXICAN AL FAHAM - Full", price: 570 },
      { name: "JALLIKATT AL FAHAM - Quarter", price: 180 },
      { name: "JALLIKATT AL FAHAM - Half", price: 335 },
      { name: "JALLIKATT AL FAHAM - Full", price: 650 },
    ]
  },
  {
    category: "TENDER SPECIALS",
    items: [
      { name: "TENDER SHAKE", price: 105 },
      { name: "TENDER BOOST", price: 105 },
      { name: "TENDER MAGIC", price: 125 },
      { name: "TENDER CASHEW", price: 125 },
      { name: "TENDER BANANA", price: 125 },
      { name: "TENDER CHIKKU", price: 125 },
      { name: "TENDER MANGO", price: 125 },
      { name: "TENDER DRY FRUITS", price: 135 },
    ]
  },
  {
    category: "ICE CREAM SCOOP",
    items: [
      { name: "VANILLA", price: 85 },
      { name: "PISTA", price: 85 },
      { name: "BUTTERSCOTCH", price: 85 },
      { name: "CHOCOLATE", price: 85 },
      { name: "MANGO", price: 85 },
      { name: "STRAWBERRY", price: 85 },
    ]
  },
  {
    category: "BEEF TAWAH",
    items: [
      { name: "TAWAH MANDI - Quarter", price: 305 },
      { name: "TAWAH MANDI - Half", price: 590 },
      { name: "TAWAH MANDI - Full", price: 1155 },
      { name: "TAWAH PIECE - Quarter", price: 210 },
      { name: "TAWAH PIECE - Half", price: 400 },
      { name: "TAWAH PIECE - Full", price: 790 },
    ]
  },
  {
    category: "BEEF JALLIKATT RIBS",
    items: [
      { name: "JALLIKATT RIBS MANDI - Quarter", price: 335 },
      { name: "JALLIKATT RIBS MANDI - Half", price: 650 },
      { name: "JALLIKATT RIBS MANDI - Full", price: 1260 },
      { name: "JALLIKATT RIBS PIECE - Quarter", price: 240 },
      { name: "JALLIKATT RIBS PIECE - Half", price: 475 },
      { name: "JALLIKATT RIBS PIECE - Full", price: 945 },
    ]
  },
  {
    category: "BEEF MADFOON",
    items: [
      { name: "BEEF MADFOON - Quarter", price: 350 },
      { name: "BEEF MADFOON - Half", price: 660 },
      { name: "BEEF MADFOON - Full", price: 1208 },
      { name: "BEEF MADFOON PIECE - Quarter", price: 230 },
      { name: "BEEF MADFOON PIECE - Half", price: 440 },
      { name: "BEEF MADFOON PIECE - Full", price: 840 },
    ]
  },
  {
    category: "MUTTON",
    items: [
      { name: "MUTTON MANDI - Quarter", price: 475 },
      { name: "MUTTON MANDI - Half", price: 840 },
      { name: "MUTTON MANDI - Full", price: 1680 },
      { name: "MUTTON PIECE - Quarter", price: 380 },
      { name: "MUTTON PIECE - Half", price: 715 },
      { name: "MUTTON PIECE - Full", price: 1365 },
    ]
  },
  {
    category: "ALFAHAM MANDI",
    items: [
      { name: "NORMAL AL FAHAM MANDI - Quarter", price: 230 },
      { name: "NORMAL AL FAHAM MANDI - Half", price: 440 },
      { name: "NORMAL AL FAHAM MANDI - Full", price: 840 },
      { name: "PERI-PERI AL FAHAM MANDI - Quarter", price: 250 },
      { name: "PERI-PERI AL FAHAM MANDI - Half", price: 485 },
      { name: "PERI-PERI AL FAHAM MANDI - Full", price: 900 },
      { name: "SMOKEY AL FAHAM MANDI - Quarter", price: 250 },
      { name: "SMOKEY AL FAHAM MANDI - Half", price: 485 },
      { name: "SMOKEY AL FAHAM MANDI - Full", price: 900 },
      { name: "JAMAICAN AL FAHAM MANDI - Quarter", price: 250 },
      { name: "JAMAICAN AL FAHAM MANDI - Half", price: 485 },
      { name: "JAMAICAN AL FAHAM MANDI - Full", price: 900 },
      { name: "BBQ AL FAHAM MANDI - Quarter", price: 250 },
      { name: "BBQ AL FAHAM MANDI - Half", price: 485 },
      { name: "BBQ AL FAHAM MANDI - Full", price: 900 },
      { name: "MEXICAN AL FAHAM MANDI - Quarter", price: 250 },
      { name: "MEXICAN AL FAHAM MANDI - Half", price: 485 },
      { name: "MEXICAN AL FAHAM MANDI - Full", price: 900 },
      { name: "JALLIKATTU AL FAHAM MANDI - Quarter", price: 275 },
      { name: "JALLIKATTU AL FAHAM MANDI - Half", price: 525 },
      { name: "JALLIKATTU AL FAHAM MANDI - Full", price: 1000 },
    ]
  },
  {
    category: "MADHOOTH",
    items: [
      { name: "CHICKEN MADHOOTH - Quarter", price: 210 },
      { name: "CHICKEN MADHOOTH - Half", price: 400 },
      { name: "CHICKEN MADHOOTH - Full", price: 790 },
      { name: "CHICKEN MADHOOTH PIECE - Quarter", price: 135 },
      { name: "CHICKEN MADHOOTH PIECE - Half", price: 260 },
      { name: "CHICKEN MADHOOTH PIECE - Full", price: 505 },
    ]
  },
  {
    category: "BREADS",
    items: [
      { name: "KUBOOS", price: 12 },
      { name: "ROMALI ROTTI", price: 22 },
    ]
  },
  {
    category: "ADD ONS",
    items: [
      { name: "MAYONNAISE - Small", price: 10 },
      { name: "MAYONNAISE - Large", price: 20 },
      { name: "MANDI RICE - Quarter", price: 100 },
      { name: "MANDI RICE - Half", price: 200 },
      { name: "MANDI RICE - Full", price: 400 },
    ]
  },
  {
    category: "BEEF RIBS",
    items: [
      { name: "RIBS MANDI - Quarter", price: 305 },
      { name: "RIBS MANDI - Half", price: 590 },
      { name: "RIBS MANDI - Full", price: 1155 },
      { name: "RIB PIECE - Quarter", price: 210 },
      { name: "RIB PIECE - Half", price: 400 },
      { name: "RIB PIECE - Full", price: 790 },
    ]
  },
  {
    category: "LIME",
    items: [
      { name: "FRESH LIME", price: 25 },
      { name: "MINT LIME", price: 30 },
      { name: "GINGER LIME", price: 30 },
      { name: "GRAPE LIME", price: 40 },
      { name: "ORANGE LIME", price: 40 },
      { name: "PINEAPPLE LIME", price: 40 },
      { name: "LIME SODA", price: 30 },
      { name: "CHILLI SODA", price: 30 },
    ]
  },
  {
    category: "FRESH JUICE",
    items: [
      { name: "WATER MELON", price: 75 },
      { name: "ORANGE", price: 85 },
      { name: "PINEAPPLE", price: 85 },
      { name: "GRAPE", price: 95 },
      { name: "APPLE", price: 105 },
      { name: "ANAR", price: 105 },
    ]
  },
  {
    category: "MOJITO",
    items: [
      { name: "BLACK CURRENT", price: 95 },
      { name: "BLUE BERRY", price: 95 },
      { name: "BLUE CURACAO", price: 95 },
      { name: "GREEN APPLE", price: 95 },
      { name: "KIWI", price: 95 },
      { name: "STRAWBERRY", price: 95 },
      { name: "PASSION FRUIT", price: 95 },
      { name: "GUAVA", price: 95 },
      { name: "LITCHI", price: 95 },
      { name: "MANGO", price: 95 },
      { name: "PINEAPPLE", price: 95 },
    ]
  },
  {
    category: "SHAKES",
    items: [
      { name: "APPLE SHAKE", price: 105 },
      { name: "CHIKKU SHAKE", price: 105 },
      { name: "MANGO SHAKE", price: 105 },
      { name: "SHAMAM SHAKE", price: 105 },
      { name: "PISTA SHAKE", price: 105 },
      { name: "VANILLA SHAKE", price: 105 },
      { name: "STRAWBERRY SHAKE", price: 105 },
      { name: "BUTTER SCOTCH SHAKE", price: 105 },
    ]
  },
  {
    category: "FALOODA",
    items: [
      { name: "NORMAL FALOODA", price: 125 },
      { name: "MANGO FALOODA", price: 170 },
      { name: "PISTA FALOODA", price: 170 },
      { name: "ROYAL FALOODA", price: 200 },
      { name: "DRY FRUIT FALOODA", price: 210 },
    ]
  },
  {
    category: "CHOCOLATE SHAKES",
    items: [
      { name: "BOOST SHAKE", price: 85 },
      { name: "SHARJAH SHAKE", price: 105 },
      { name: "CHOCOLATE SHAKE", price: 105 },
      { name: "DAIRY MILK SHAKE", price: 105 },
      { name: "GEMS SHAKE", price: 105 },
      { name: "KITKAT SHAKE", price: 105 },
      { name: "OREO SHAKE", price: 105 },
      { name: "SNICKERS SHAKE", price: 105 },
      { name: "MONSTER SHAKE", price: 160 },
    ]
  }
];

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

  // Delete associated data
  console.log("Deleting Payments and PlatformFees...");
  const orders = await prisma.order.findMany({ where: { restaurantId } });
  const orderIds = orders.map(o => o.id);

  if (orderIds.length > 0) {
    await prisma.payment.deleteMany({ where: { orderId: { in: orderIds } } });
    await prisma.platformFee.deleteMany({ where: { orderId: { in: orderIds } } });
  }

  console.log("Deleting Orders...");
  await prisma.order.deleteMany({ where: { restaurantId } });

  console.log("Deleting Staff (except Owner)...");
  await prisma.user.deleteMany({
    where: {
      restaurantId,
      role: { not: 'Owner' }
    }
  });

  console.log("Deleting MenuItems...");
  await prisma.menuItem.deleteMany({ where: { restaurantId } });

  console.log("Deleting Categories...");
  await prisma.category.deleteMany({ where: { restaurantId } });

  // Add new menu
  console.log("Adding new menu...");
  for (let i = 0; i < menuData.length; i++) {
    const catData = menuData[i];
    const category = await prisma.category.create({
      data: {
        name: catData.category,
        restaurantId,
        display_order: i
      }
    });

    for (let j = 0; j < catData.items.length; j++) {
      const itemData = catData.items[j];
      await prisma.menuItem.create({
        data: {
          name: itemData.name,
          price: itemData.price,
          restaurantId,
          categoryId: category.id,
          display_order: j
        }
      });
    }
  }

  console.log("Finished successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
