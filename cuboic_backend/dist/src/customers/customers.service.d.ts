import { PrismaService } from '../prisma/prisma.service';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByPhone(phone: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            phone: string;
        } | null;
        phone: string;
    }>;
    register(phone: string, name: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        phone: string;
    }>;
}
