import { PrismaService } from '../prisma/prisma.service';
export declare class TablesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(restaurantId: string, table_number: string): import("@prisma/client").Prisma.Prisma__TableClient<{
        restaurantId: string;
        id: string;
        table_number: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateStatus(id: string, is_active: boolean): import("@prisma/client").Prisma.Prisma__TableClient<{
        restaurantId: string;
        id: string;
        table_number: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
