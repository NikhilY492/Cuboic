import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types, Model } from 'mongoose';
import { MenuItem, MenuItemDocument } from './schemas/menu-item.schema';
import { Category, CategoryDocument } from '../categories/schemas/category.schema';
import { Table, TableDocument } from '../tables/schemas/table.schema';

@Injectable()
export class MenuService {
    constructor(
        @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
        @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    ) { }

    async getMenu(restaurantId: string, tableId?: string, categoryId?: string) {
        if (!Types.ObjectId.isValid(restaurantId)) {
            throw new BadRequestException(`Invalid restaurant ID: "${restaurantId}"`);
        }

        if (tableId) {
            if (!Types.ObjectId.isValid(tableId)) {
                throw new BadRequestException(`Invalid table ID: "${tableId}"`);
            }

            const table = await this.tableModel.findOne({
                _id: new Types.ObjectId(tableId),
                restaurant_id: new Types.ObjectId(restaurantId),
                is_active: true,
            });
            if (!table) throw new NotFoundException('Table not found or inactive');
        }

        const filter: Record<string, any> = {
            restaurant_id: new Types.ObjectId(restaurantId),
            is_available: true,
        };

        if (categoryId) {
            if (!Types.ObjectId.isValid(categoryId)) {
                throw new BadRequestException(`Invalid category ID: "${categoryId}"`);
            }
            filter.category_id = new Types.ObjectId(categoryId);
        }

        return this.menuItemModel.find(filter).sort({ display_order: 1 });
    }
}