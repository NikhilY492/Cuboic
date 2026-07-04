import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for Food Guru restaurant...');
    const restaurant = await prisma.restaurant.findFirst({
        where: { name: { contains: 'Food guru', mode: 'insensitive' } },
        include: { tables: true, menuItems: true }
    });

    if (!restaurant) {
        console.log('Restaurant not found!');
        return;
    }
    console.log(`Found restaurant: ${restaurant.name} (${restaurant.id})`);
    
    if (restaurant.menuItems.length === 0) {
        console.log('Restaurant has no menu items to create orders with!');
        return;
    }
    
    const NUM_ORDERS = 150; 
    const now = new Date();
    
    console.log(`Generating ${NUM_ORDERS} mock orders for the last 3 months...`);
    
    for (let i = 0; i < NUM_ORDERS; i++) {
        // Random date within the last 90 days
        const pastDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        
        // Pick a random table
        const table = restaurant.tables.length > 0 
            ? restaurant.tables[Math.floor(Math.random() * restaurant.tables.length)]
            : null;
        
        // Pick 1-4 random menu items
        const numItems = Math.floor(Math.random() * 4) + 1;
        const items: any[] = [];
        let subtotal = 0;
        
        for (let j = 0; j < numItems; j++) {
            const mi = restaurant.menuItems[Math.floor(Math.random() * restaurant.menuItems.length)];
            const qty = Math.floor(Math.random() * 3) + 1;
            items.push({
                item_id: mi.id,
                name: mi.name,
                unit_price: mi.price,
                quantity: qty
            });
            subtotal += mi.price * qty;
        }
        
        const tax = subtotal * 0.05; // Assuming 5% tax
        const total = subtotal + tax;
        
        await prisma.order.create({
            data: {
                restaurantId: restaurant.id,
                tableId: table ? table.id : 'takeaway_virtual',
                customer_session_id: 'mock-session-' + i,
                items: items,
                subtotal,
                tax,
                total,
                status: 'Delivered', // Completed status for analytics
                createdAt: pastDate,
                updatedAt: pastDate,
                payment: {
                    create: {
                        amount: total,
                        method: Math.random() > 0.3 ? 'UPI' : (Math.random() > 0.5 ? 'Cash' : 'Card'),
                        status: 'Paid',
                        createdAt: pastDate,
                        updatedAt: pastDate
                    }
                }
            }
        });
    }
    
    console.log(`Successfully inserted ${NUM_ORDERS} mock orders for ${restaurant.name}!`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
