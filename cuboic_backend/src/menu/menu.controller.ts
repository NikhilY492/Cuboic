import { Controller, Get, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';

@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) { }

    @Get()
    getMenu(@Query() query: QueryMenuDto) {
        return this.menuService.getMenu(query.restaurant_id, query.table_id, query.category_id);
    }
}
