import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Robot, RobotDocument } from './schemas/robot.schema';

@Injectable()
export class RobotsService {
    constructor(@InjectModel(Robot.name) private robotModel: Model<RobotDocument>) { }

    findAll(restaurantId: string) {
        return this.robotModel.find({ restaurant_id: new Types.ObjectId(restaurantId) });
    }

    findOne(id: string) {
        return this.robotModel.findById(id);
    }
    async markOnline(robotId: string) {
        return this.robotModel.findByIdAndUpdate(robotId, {
            isOnline: true,
            lastSeen: new Date(),
        });
    }

    async markOffline(robotId: string) {
        return this.robotModel.findByIdAndUpdate(robotId, {
            isOnline: false,
        });
    }

    async updateTelemetry(robotId: string, telemetry: any) {
        return this.robotModel.findByIdAndUpdate(robotId, {
            battery: telemetry.battery,
            location: telemetry.location,
            lastSeen: new Date(),
        });
    }
    async findByIdWithSecret(robotId: string) {
        return this.robotModel.findById(robotId).select('+secretKey');
    }
}
