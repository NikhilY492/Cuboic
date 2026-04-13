import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const foodGuru = await prisma.restaurant.findFirst({
        where: {
            name: {
                contains: 'Food Guru',
                mode: 'insensitive'
            }
        }
    });

    if (!foodGuru) {
        console.error("Food Guru restaurant not found!");
        return;
    }

    console.log(`Found Food Guru restaurant with ID: ${foodGuru.id}`);

    const result = await prisma.user.deleteMany({
        where: {
            OR: [
                { restaurantId: null },
                { restaurantId: { not: foodGuru.id } }
            ]
        }
    });

    console.log(`Deleted ${result.count} users not associated with Food Guru.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
