import { CategoriesService } from './categories.service';
declare class CreateCategoryDto {
    restaurantId: string;
    name: string;
    display_order?: number;
}
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        display_order: number;
    }[]>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        display_order: number;
    }>;
}
export {};
