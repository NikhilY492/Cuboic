import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RobotTelemetryDocument = RobotTelemetry & Document;

@Schema({ timestamps: true })
export class RobotTelemetry {
    @Prop({ type: Types.ObjectId, ref: 'Robot', required: true })
    robot_id: Types.ObjectId;

    @Prop({ required: true })
    battery_level: number;

    @Prop({ type: { x: Number, y: Number, z: Number }, default: { x: 0, y: 0, z: 0 } })
    position: { x: number; y: number; z: number };

    @Prop({ type: String, enum: ['Idle', 'Delivering', 'Charging', 'Offline'] })
    status: string;

    @Prop()
    speed: number;

    @Prop({ default: Date.now })
    recorded_at: Date;
}

export const RobotTelemetrySchema = SchemaFactory.createForClass(RobotTelemetry);
