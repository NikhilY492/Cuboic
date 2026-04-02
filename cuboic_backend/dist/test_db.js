"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function testConnection() {
    const prisma = new client_1.PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    });
    console.log('⏳ Attempting to connect to database...');
    try {
        await prisma.$connect();
        console.log('✅ Successfully connected to the database!');
        const usersCount = await prisma.user.count();
        console.log(`📊 Number of users in DB: ${usersCount}`);
    }
    catch (error) {
        console.error('❌ Connection failed:');
        console.error(error);
    }
    finally {
        await prisma.$disconnect();
    }
}
testConnection();
//# sourceMappingURL=test_db.js.map