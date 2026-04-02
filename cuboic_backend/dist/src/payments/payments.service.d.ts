import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(restaurantId: string, from?: string, to?: string): import("@prisma/client").Prisma.PrismaPromise<({
        order: {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            outletId: string | null;
            tableId: string;
            customerId: string | null;
            customer_session_id: string;
            orderType: string;
            items: import("@prisma/client/runtime/library").JsonValue;
            subtotal: number;
            tax: number;
            total: number;
            status: import("@prisma/client").$Enums.OrderStatus;
            notes: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        orderId: string;
        status: import("@prisma/client").$Enums.PaymentStatus;
        method: string;
        transaction_id: string | null;
    })[]>;
    getSummary(restaurantId: string): Promise<{
        order_count: number;
        total_revenue: number;
    }>;
}
