import { Document, Types } from 'mongoose';
export type TableDocument = Table & Document;
export declare class Table {
    restaurant_id: Types.ObjectId;
    table_number: string;
    is_active: boolean;
}
export declare const TableSchema: import("mongoose").Schema<Table, import("mongoose").Model<Table, any, any, any, (Document<unknown, any, Table, any, import("mongoose").DefaultSchemaOptions> & Table & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Table, any, import("mongoose").DefaultSchemaOptions> & Table & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Table>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Table, Document<unknown, {}, Table, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurant_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    table_number?: import("mongoose").SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    is_active?: import("mongoose").SchemaDefinitionProperty<boolean, Table, Document<unknown, {}, Table, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Table & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Table>;
