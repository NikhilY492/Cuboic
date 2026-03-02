import { MenuService } from './menu.service';
import { QueryMenuDto } from './dto/query-menu.dto';
export declare class MenuController {
    private readonly menuService;
    constructor(menuService: MenuService);
    getMenu(query: QueryMenuDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/menu-item.schema").MenuItemDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/menu-item.schema").MenuItem & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
}
