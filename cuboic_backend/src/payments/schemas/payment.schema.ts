import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    order_id: Types.ObjectId;

    @Prop({ required: true })
    amount: number;

    @Prop({
        type: String,
        enum: ['Online', 'Cash', 'Card'],
        default: 'Online',
    })
    method: 'Online' | 'Cash' | 'Card';

    @Prop({
        type: String,
        enum: ['Pending', 'Paid', 'Refunded'],
        default: 'Pending',
    })
    status: 'Pending' | 'Paid' | 'Refunded';

    @Prop()
    transaction_id: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
