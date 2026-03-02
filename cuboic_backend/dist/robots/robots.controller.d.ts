import { RobotsService } from './robots.service';
export declare class RobotsController {
    private readonly robotsService;
    constructor(robotsService: RobotsService);
    findAll(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/robot.schema").RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot.schema").Robot & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/robot.schema").RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot.schema").Robot & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/robot.schema").RobotDocument, "find", {}>;
    findOne(id: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/robot.schema").RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot.schema").Robot & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null, import("mongoose").Document<unknown, {}, import("./schemas/robot.schema").RobotDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/robot.schema").Robot & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/robot.schema").RobotDocument, "findOne", {}>;
}
