import { TelemetryService } from './telemetry.service';
export declare class TelemetryController {
    private readonly telemetryService;
    constructor(telemetryService: TelemetryService);
    getLatest(robotId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot-telemetry.schema").RobotTelemetry & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot-telemetry.schema").RobotTelemetry & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, "findOne", {}>;
    getHistory(robotId: string, limit?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot-telemetry.schema").RobotTelemetry & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot-telemetry.schema").RobotTelemetry & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/robot-telemetry.schema").RobotTelemetryDocument, "find", {}>;
}
