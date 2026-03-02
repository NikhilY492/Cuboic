import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async create(dto: CreateUserDto) {
        const existing = await this.userModel.findOne({ user_id: dto.user_id });
        if (existing) throw new ConflictException('User ID already taken');

        const password_hash = await bcrypt.hash(dto.password, 10);
        const user = await this.userModel.create({
            name: dto.name,
            user_id: dto.user_id,
            password_hash,
            role: dto.role,
            restaurant_id: dto.restaurant_id ? new Types.ObjectId(dto.restaurant_id) : undefined,
        });

        const { password_hash: _, ...result } = (user as any).toObject();
        return result;
    }

    findAll(restaurantId: string) {
        return this.userModel
            .find({ restaurant_id: new Types.ObjectId(restaurantId) })
            .select('-password_hash');
    }

    async findByUserId(userId: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ user_id: userId });
    }
}
