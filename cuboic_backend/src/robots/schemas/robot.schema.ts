import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RobotDocument = Robot & Document;

/**
 * Operational state of robot inside restaurant workflow
 */
export type RobotStatus =
    | 'Idle'
    | 'Assigned'
    | 'Delivering'
    | 'Returning'
    | 'Charging'
    | 'Error';

/**
 * Control mode of robot
 */
export type RobotMode =
    | 'Automatic'
    | 'Manual'
    | 'Stopped';

/**
 * Cabinet structure
 */
class Cabinet {
    @Prop({ required: true })
    id: string;

    @Prop({
        type: String,
        enum: ['Free', 'Occupied'],
        default: 'Free',
    })
    status: 'Free' | 'Occupied';
}

@Schema({ timestamps: true })
export class Robot {
    /**
     * Multi-tenant isolation
     */
    @Prop({
        type: Types.ObjectId,
        ref: 'Restaurant',
        required: true,
        index: true,
    })
    restaurant_id: Types.ObjectId;

    /**
     * Robot display name
     */
    @Prop({ required: true })
    name: string;

    /**
     * Secret key for device authentication
     */
    @Prop({ required: true, select: false })
    secretKey: string;

    /**
     * Operational workflow status
     */
    @Prop({
        type: String,
        enum: [
            'Idle',
            'Assigned',
            'Delivering',
            'Returning',
            'Charging',
            'Error',
        ],
        default: 'Idle',
    })
    status: RobotStatus;

    /**
     * Control mode (manual override support)
     */
    @Prop({
        type: String,
        enum: ['Automatic', 'Manual', 'Stopped'],
        default: 'Automatic',
    })
    mode: RobotMode;

    /**
     * Currently assigned delivery (if any)
     */
    @Prop({ type: Types.ObjectId, ref: 'Delivery', default: null })
    currentDeliveryId?: Types.ObjectId | null;

    /**
     * Connection state
     */
    @Prop({ default: false })
    isOnline: boolean;

    /**
     * Last heartbeat timestamp
     */
    @Prop()
    lastSeen: Date;

    /**
     * Battery percentage (single source of truth)
     */
    @Prop({ default: 100 })
    battery: number;

    /**
     * Real-time position
     */
    @Prop({
        type: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
        },
    })
    location: {
        x: number;
        y: number;
    };

    /**
     * Storage cabinets
     */
    @Prop({
        type: [
            {
                id: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['Free', 'Occupied'],
                    default: 'Free',
                },
            },
        ],
        default: [
            { id: 'C1', status: 'Free' },
            { id: 'C2', status: 'Free' },
            { id: 'C3', status: 'Free' },
        ],
    })
    cabinets: Cabinet[];
}

export const RobotSchema = SchemaFactory.createForClass(Robot);