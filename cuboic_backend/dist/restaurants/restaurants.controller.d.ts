import { RestaurantsService } from './restaurants.service';
import { Types } from 'mongoose';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    getAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/restaurant.schema").RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/restaurant.schema").Restaurant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    getById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/restaurant.schema").RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/restaurant.schema").Restaurant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/restaurant.schema").RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/restaurant.schema").Restaurant & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
