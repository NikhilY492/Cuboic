import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(@Query('restaurant_id') restaurantId: string) {
        return this.categoriesService.findAll(restaurantId);
    }
}
