import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService implements OnModuleInit {
    private prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    verifyFirebaseToken(idToken: string): Promise<{
        verified: boolean;
        customer: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        phone: string;
    }>;
    register(phone: string, name: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
    }>;
}
