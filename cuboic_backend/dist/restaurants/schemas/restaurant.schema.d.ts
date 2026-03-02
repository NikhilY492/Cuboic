import { Document } from 'mongoose';
export type RestaurantDocument = Restaurant & Document;
export declare class Restaurant {
    name: string;
    description: string;
    logo_url: string;
    is_active: boolean;
}
export declare const RestaurantSchema: import("mongoose").Schema<Restaurant, import("mongoose").Model<Restaurant, any, any, any, (Document<unknown, any, Restaurant, any, import("mongoose").DefaultSchemaOptions> & Restaurant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Restaurant, any, import("mongoose").DefaultSchemaOptions> & Restaurant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}), any, Restaurant>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Restaurant, Document<unknown, {}, Restaurant, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    name?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    logo_url?: import("mongoose").SchemaDefinitionProperty<string, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    is_active?: import("mongoose").SchemaDefinitionProperty<boolean, Restaurant, Document<unknown, {}, Restaurant, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Restaurant & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Restaurant>;
