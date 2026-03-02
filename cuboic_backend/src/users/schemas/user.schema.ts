import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export type UserRole = 'Admin' | 'Owner' | 'Staff';

@Schema({ timestamps: true })
export class User {
    @Prop({ type: Types.ObjectId, ref: 'Restaurant' })
    restaurant_id: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, trim: true })
    user_id: string;

    @Prop({ required: true })
    password_hash: string;

    @Prop({
        type: String,
        enum: ['Admin', 'Owner', 'Staff'],
        default: 'Staff',
    })
    role: UserRole;

    @Prop({ default: true })
    is_active: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
