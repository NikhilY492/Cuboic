import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TableDocument = Table & Document;

@Schema({ timestamps: true })
export class Table {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant', required: true })
    restaurant_id: Types.ObjectId;

    @Prop({ required: true })
    table_number: string;

    @Prop({ default: true })
    is_active: boolean;
}

export const TableSchema = SchemaFactory.createForClass(Table);
