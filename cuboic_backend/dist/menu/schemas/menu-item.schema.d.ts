import { Document, Types } from 'mongoose';
export type MenuItemDocument = MenuItem & Document;
export declare class MenuItem {
    restaurant_id: Types.ObjectId;
    category_id: Types.ObjectId;
    name: string;
    description: string;
    price: number;
    image_url: string;
    is_available: boolean;
    display_order: number;
}
export declare const MenuItemSchema: import("mongoose").Schema<MenuItem, import("mongoose").Model<MenuItem, any, any, any, (Document<unknown, any, MenuItem, any, import("mongoose").DefaultSchemaOptions> & MenuItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, MenuItem, any, import("mongoose").DefaultSchemaOptions> & MenuItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, MenuItem>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, MenuItem, Document<unknown, {}, MenuItem, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurant_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    category_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    description?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    price?: import("mongoose").SchemaDefinitionProperty<number, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    image_url?: import("mongoose").SchemaDefinitionProperty<string, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    is_available?: import("mongoose").SchemaDefinitionProperty<boolean, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    display_order?: import("mongoose").SchemaDefinitionProperty<number, MenuItem, Document<unknown, {}, MenuItem, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<MenuItem & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, MenuItem>;
