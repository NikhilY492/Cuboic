import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CacheInterceptor, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // Public — customer-facing (no auth)
  @UseInterceptors(CacheInterceptor)
  @Get()
  getMenu(@Query() query: QueryMenuDto) {
    return this.menuService.getMenu(
      query.restaurantId,
      query.tableId,
      query.categoryId,
    );
  }

  // Admin — fetch ALL items (including unavailable)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @UseInterceptors(CacheInterceptor)
  @Get('admin')
  getAdminMenu(@Query('restaurantId') restaurantId: string) {
    return this.menuService.getAllForAdmin(restaurantId);
  }

  // Admin — create a new menu item
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Post()
  async createItem(@Body() dto: CreateMenuItemDto) {
    const item = await this.menuService.createItem(dto);
    await this.cacheManager.reset();
    return item;
  }

  // Admin — update an existing menu item (price, availability, etc.)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Put(':id')
  async updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    const item = await this.menuService.updateItem(id, dto);
    await this.cacheManager.reset();
    return item;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Patch('bulk')
  async bulkUpdate(
    @Query('restaurantId') restaurantId: string,
    @Body() body: Array<{ id: string; data: Partial<UpdateMenuItemDto> }>,
  ) {
    const items = await this.menuService.bulkUpdate(restaurantId, body);
    await this.cacheManager.reset();
    return items;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Owner', 'Manager', 'Captain')
  @Patch(':id/86')
  async toggleAvailability(
    @Param('id') id: string,
    @Body('is_available') is_available: boolean,
    @Req() req: any,
  ) {
    const item = await this.menuService.toggleAvailability(id, is_available, req.user.sub);
    await this.cacheManager.reset();
    return item;
  }
}
