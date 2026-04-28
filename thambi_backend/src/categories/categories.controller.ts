import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

class CreateCategoryDto {
    @IsString() @IsNotEmpty() restaurantId: string;
    @IsString() @IsNotEmpty() name: string;
    @IsOptional() @IsNumber() display_order?: number;
}

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll(@Query('restaurantId') restaurantId: string) {
        return this.categoriesService.findAll(restaurantId);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }
}
