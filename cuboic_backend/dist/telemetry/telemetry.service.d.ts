import { Model, Types } from 'mongoose';
import { RobotTelemetry, RobotTelemetryDocument } from './schemas/robot-telemetry.schema';
export declare class TelemetryService {
    private telemetryModel;
    constructor(telemetryModel: Model<RobotTelemetryDocument>);
    getLatest(robotId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, RobotTelemetryDocument, "findOne", {}>;
    getHistory(robotId: string, limit?: number): import("mongoose").Query<(import("mongoose").Document<unknown, {}, RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, RobotTelemetryDocument, "find", {}>;
    recordTelemetry(data: {
        robotId: string;
        battery: number;
        location: {
            x: number;
            y: number;
        };
        status?: string;
        speed?: number;
    }): Promise<import("mongoose").Document<unknown, {}, RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & RobotTelemetry & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
