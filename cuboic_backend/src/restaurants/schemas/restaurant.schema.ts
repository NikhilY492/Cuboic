import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop()
    logo_url: string;

    @Prop({ default: true })
    is_active: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
