import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ default: 0 })
    display_order: number;

    @Prop({ default: true })
    is_active: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
