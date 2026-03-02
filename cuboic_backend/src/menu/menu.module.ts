import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuItem, MenuItemSchema } from './schemas/menu-item.schema';
import { Category, CategorySchema } from '../categories/schemas/category.schema';
import { Table, TableSchema } from '../tables/schemas/table.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: MenuItem.name, schema: MenuItemSchema },
            { name: Category.name, schema: CategorySchema },
            { name: Table.name, schema: TableSchema },
        ]),
    ],
    controllers: [MenuController],
    providers: [MenuService],
    exports: [MongooseModule],
})
export class MenuModule { }
