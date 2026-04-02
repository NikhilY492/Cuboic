import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuService {
    private prisma;
    constructor(prisma: PrismaService);
    getMenu(restaurantId: string, tableId?: string, categoryId?: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        categoryId: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        display_order: number;
    }[]>;
    getAllForAdmin(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        categoryId: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        display_order: number;
    }[]>;
    createItem(dto: CreateMenuItemDto): import("@prisma/client").Prisma.Prisma__MenuItemClient<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        categoryId: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        display_order: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateItem(id: string, dto: UpdateMenuItemDto): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        categoryId: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        display_order: number;
    }>;
    deleteItem(id: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        categoryId: string;
        description: string | null;
        price: number;
        image_url: string | null;
        is_available: boolean;
        display_order: number;
    }>;
}
