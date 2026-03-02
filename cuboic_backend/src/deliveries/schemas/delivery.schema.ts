import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DeliveryDocument = Delivery & Document;

class DeliveryStop {
    order_id: Types.ObjectId;
    table_id: Types.ObjectId;
    cabinets: string[];
    sequence: number;
    status: 'Pending' | 'Delivered';
    delivered_at?: Date;
}

@Schema({ timestamps: true })
export class Delivery {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Robot', required: true })
    robot_id: Types.ObjectId;

    @Prop({
        type: [
            {
                order_id: { type: Types.ObjectId, ref: 'Order' },
                table_id: { type: Types.ObjectId, ref: 'Table' },
                cabinets: [String],
                sequence: Number,
                status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' },
                delivered_at: Date,
            },
        ],
        required: true,
    })
    stops: DeliveryStop[];

    @Prop({
        type: String,
        enum: ['InTransit', 'Completed', 'Cancelled'],
        default: 'InTransit',
    })
    status: 'InTransit' | 'Completed' | 'Cancelled';
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery);
