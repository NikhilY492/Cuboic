import { Controller, Get, Post, Body, Query, UseGuards, UseInterceptors, Inject } from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
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
  constructor(
    private readonly categoriesService: CategoriesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(@Query('restaurantId') restaurantId: string) {
    return this.categoriesService.findAll(restaurantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCategoryDto) {
    const cat = await this.categoriesService.create(dto);
    if ((this.cacheManager as any).clear) {
      await (this.cacheManager as any).clear();
    } else if ((this.cacheManager as any).reset) {
      await (this.cacheManager as any).reset();
    }
    return cat;
  }
}
