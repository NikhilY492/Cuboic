import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    ) { }

    findAll(restaurantId: string) {
        return this.categoryModel
            .find({ restaurant_id: new Types.ObjectId(restaurantId), is_active: true })
            .sort({ display_order: 1 });
    }
}
