import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

export type OrderStatus =
    | 'Pending'
    | 'Confirmed'
    | 'Preparing'
    | 'Ready'
    | 'Assigned'
    | 'Delivered'
    | 'Cancelled';

class OrderItem {
    item_id: Types.ObjectId;
    name: string;
    unit_price: number;
    quantity: number;
}

@Schema({ timestamps: true })
export class Order {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Table', required: true })
    table_id: Types.ObjectId;

    @Prop({ required: true })
    customer_session_id: string;

    @Prop({
        type: [
            {
                item_id: { type: Types.ObjectId, ref: 'MenuItem' },
                name: String,
                unit_price: Number,
                quantity: Number,
            },
        ],
        required: true,
    })
    items: OrderItem[];

    @Prop({ required: true })
    subtotal: number;

    @Prop({ required: true })
    tax: number;

    @Prop({ required: true })
    total: number;

    @Prop({
        type: String,
        enum: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Assigned', 'Delivered', 'Cancelled'],
        default: 'Pending',
    })
    status: OrderStatus;

    @Prop({ type: Types.ObjectId, ref: 'Payment' })
    payment_id: Types.ObjectId;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
