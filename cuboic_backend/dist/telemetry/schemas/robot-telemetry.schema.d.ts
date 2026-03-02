import { Document, Types } from 'mongoose';
export type RobotTelemetryDocument = RobotTelemetry & Document;
export declare class RobotTelemetry {
    robot_id: Types.ObjectId;
    battery_level: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    status: string;
    speed: number;
    recorded_at: Date;
}
export declare const RobotTelemetrySchema: import("mongoose").Schema<RobotTelemetry, import("mongoose").Model<RobotTelemetry, any, any, any, (Document<unknown, any, RobotTelemetry, any, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, RobotTelemetry, any, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, RobotTelemetry>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    robot_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    battery_level?: import("mongoose").SchemaDefinitionProperty<number, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    position?: import("mongoose").SchemaDefinitionProperty<{
        x: number;
        y: number;
        z: number;
    }, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    speed?: import("mongoose").SchemaDefinitionProperty<number, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    recorded_at?: import("mongoose").SchemaDefinitionProperty<Date, RobotTelemetry, Document<unknown, {}, RobotTelemetry, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RobotTelemetry & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, RobotTelemetry>;
