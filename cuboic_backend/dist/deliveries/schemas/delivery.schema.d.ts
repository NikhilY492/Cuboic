import { Document, Types } from 'mongoose';
export type DeliveryDocument = Delivery & Document;
declare class DeliveryStop {
    order_id: Types.ObjectId;
    table_id: Types.ObjectId;
    cabinets: string[];
    sequence: number;
    status: 'Pending' | 'Delivered';
    delivered_at?: Date;
}
export declare class Delivery {
    restaurant_id: Types.ObjectId;
    robot_id: Types.ObjectId;
    stops: DeliveryStop[];
    status: 'InTransit' | 'Completed' | 'Cancelled';
}
export declare const DeliverySchema: import("mongoose").Schema<Delivery, import("mongoose").Model<Delivery, any, any, any, (Document<unknown, any, Delivery, any, import("mongoose").DefaultSchemaOptions> & Delivery & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Delivery, any, import("mongoose").DefaultSchemaOptions> & Delivery & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Delivery>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Delivery, Document<unknown, {}, Delivery, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurant_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    robot_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    stops?: import("mongoose").SchemaDefinitionProperty<DeliveryStop[], Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"Cancelled" | "InTransit" | "Completed", Delivery, Document<unknown, {}, Delivery, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Delivery & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Delivery>;
export {};
