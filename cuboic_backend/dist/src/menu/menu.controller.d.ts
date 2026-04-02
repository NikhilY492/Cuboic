import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(query: QueryMenuDto): Promise<{
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
    getAdminMenu(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
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
}
