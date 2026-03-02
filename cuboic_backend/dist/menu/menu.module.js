"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const menu_controller_1 = require("./menu.controller");
const menu_service_1 = require("./menu.service");
const menu_item_schema_1 = require("./schemas/menu-item.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const table_schema_1 = require("../tables/schemas/table.schema");
let MenuModule = class MenuModule {
};
exports.MenuModule = MenuModule;
exports.MenuModule = MenuModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: menu_item_schema_1.MenuItem.name, schema: menu_item_schema_1.MenuItemSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: table_schema_1.Table.name, schema: table_schema_1.TableSchema },
            ]),
        ],
        controllers: [menu_controller_1.MenuController],
        providers: [menu_service_1.MenuService],
        exports: [mongoose_1.MongooseModule],
    })
], MenuModule);
//# sourceMappingURL=menu.module.js.map