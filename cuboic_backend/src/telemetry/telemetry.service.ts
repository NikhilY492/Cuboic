import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RobotTelemetry, RobotTelemetryDocument } from './schemas/robot-telemetry.schema';

@Injectable()
export class TelemetryService {
    constructor(
        @InjectModel(RobotTelemetry.name)
        private telemetryModel: Model<RobotTelemetryDocument>,
    ) { }

    getLatest(robotId: string) {
        return this.telemetryModel
            .findOne({ robot_id: new Types.ObjectId(robotId) })
            .sort({ recorded_at: -1 });
    }

    getHistory(robotId: string, limit = 50) {
        return this.telemetryModel
            .find({ robot_id: new Types.ObjectId(robotId) })
            .sort({ recorded_at: -1 })
            .limit(limit);
    }
    async recordTelemetry(data: {
        robotId: string;
        battery: number;
        location: { x: number; y: number };
        status?: string;
        speed?: number;
    }) {
        return this.telemetryModel.create({
            robot_id: data.robotId,
            battery_level: data.battery,
            position: {
                x: data.location.x,
                y: data.location.y,
                z: 0,
            },
            status: data.status ?? 'Idle',
            speed: data.speed ?? 0,
            recorded_at: new Date(),
        });
    }
}
