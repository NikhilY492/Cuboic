import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    getAll(): Promise<{
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo_url: string | null;
    }[]>;
    getTables(id: string): Promise<{
        id: string;
        restaurantId: string;
        table_number: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getById(id: string): Promise<{
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
    }>;
    create(body: any): Promise<{
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        logo_url: string | null;
    }>;
}
