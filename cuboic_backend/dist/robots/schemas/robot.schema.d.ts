import { Document, Types } from 'mongoose';
export type RobotDocument = Robot & Document;
export type RobotStatus = 'Idle' | 'Assigned' | 'Delivering' | 'Returning' | 'Charging' | 'Error';
export type RobotMode = 'Automatic' | 'Manual' | 'Stopped';
declare class Cabinet {
    id: string;
    status: 'Free' | 'Occupied';
}
export declare class Robot {
    restaurant_id: Types.ObjectId;
    name: string;
    secretKey: string;
    status: RobotStatus;
    mode: RobotMode;
    currentDeliveryId?: Types.ObjectId | null;
    isOnline: boolean;
    lastSeen: Date;
    battery: number;
    location: {
        x: number;
        y: number;
    };
    cabinets: Cabinet[];
}
export declare const RobotSchema: import("mongoose").Schema<Robot, import("mongoose").Model<Robot, any, any, any, (Document<unknown, any, Robot, any, import("mongoose").DefaultSchemaOptions> & Robot & {
    _id: Types.ObjectId;
} & {
    __v: number;
} & {
    id: string;
}) | (Document<unknown, any, Robot, any, import("mongoose").DefaultSchemaOptions> & Robot & {
    _id: Types.ObjectId;
} & {
    __v: number;
}), any, Robot>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Robot, Document<unknown, {}, Robot, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurant_id?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    secretKey?: import("mongoose").SchemaDefinitionProperty<string, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<RobotStatus, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    mode?: import("mongoose").SchemaDefinitionProperty<RobotMode, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    currentDeliveryId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId | null | undefined, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isOnline?: import("mongoose").SchemaDefinitionProperty<boolean, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    lastSeen?: import("mongoose").SchemaDefinitionProperty<Date, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    battery?: import("mongoose").SchemaDefinitionProperty<number, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    location?: import("mongoose").SchemaDefinitionProperty<{
        x: number;
        y: number;
    }, Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    cabinets?: import("mongoose").SchemaDefinitionProperty<Cabinet[], Robot, Document<unknown, {}, Robot, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Robot & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Robot>;
export {};
