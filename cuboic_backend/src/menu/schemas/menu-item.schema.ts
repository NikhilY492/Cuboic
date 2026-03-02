import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MenuItemDocument = MenuItem & Document;

@Schema({ timestamps: true })
export class MenuItem {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category_id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ required: true })
    price: number;

    @Prop()
    image_url: string;

    @Prop({ default: true })
    is_available: boolean;

    @Prop({ default: 0 })
    display_order: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
