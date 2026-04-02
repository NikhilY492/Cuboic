import { PrismaService } from '../prisma/prisma.service';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): import("@prisma/client").Prisma.Prisma__RestaurantClient<({
        tables: {
            id: string;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
    } & {
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo_url: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findTables(restaurantId: string): Promise<{
        id: string;
        restaurantId: string;
        table_number: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo_url: string | null;
    }[]>;
    create(data: {
        name: string;
        description?: string;
        logoUrl?: string;
    }): import("@prisma/client").Prisma.Prisma__RestaurantClient<{
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo_url: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
