import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
export declare class RestaurantsService {
    private readonly restaurantModel;
    constructor(restaurantModel: Model<RestaurantDocument>);
    findById(id: string): Promise<(import("mongoose").Document<unknown, {}, RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & Restaurant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & Restaurant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    create(data: Partial<Restaurant>): Promise<import("mongoose").Document<unknown, {}, RestaurantDocument, {}, import("mongoose").DefaultSchemaOptions> & Restaurant & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
