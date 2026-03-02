import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {
    constructor(
        @InjectModel(Restaurant.name)
        private readonly restaurantModel: Model<RestaurantDocument>,
    ) { }

    async findById(id: string) {
        return this.restaurantModel.findById(id).exec();
    }

    async findAll() {
        return this.restaurantModel.find().exec();
    }

    async create(data: Partial<Restaurant>) {
        const created = new this.restaurantModel(data);
        return created.save();
    }
}