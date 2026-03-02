import { Model, Types } from 'mongoose';
import { Robot, RobotDocument } from './schemas/robot.schema';
export declare class RobotsService {
    private robotModel;
    constructor(robotModel: Model<RobotDocument>);
    findAll(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, RobotDocument, "find", {}>;
    findOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, RobotDocument, "findOne", {}>;
    markOnline(robotId: string): Promise<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    markOffline(robotId: string): Promise<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    updateTelemetry(robotId: string, telemetry: any): Promise<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    findByIdWithSecret(robotId: string): Promise<(import("mongoose").Document<unknown, {}, RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & Robot & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
