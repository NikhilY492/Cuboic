"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const events_gateway_1 = require("../events/events.gateway");
const audit_service_1 = require("../audit/audit.service");
let MenuService = class MenuService {
    prisma;
    eventsGateway;
    auditService;
    constructor(prisma, eventsGateway, auditService) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
        this.auditService = auditService;
    }
    async getMenu(restaurantId, tableId, categoryId) {
        if (tableId) {
            const table = await this.prisma.table.findFirst({
                where: { id: tableId, restaurantId, is_active: true },
            });
            if (!table)
                throw new common_1.NotFoundException('Table not found or inactive');
        }
        return this.prisma.menuItem.findMany({
            where: {
                restaurantId,
                is_available: true,
                ...(categoryId ? { categoryId } : {}),
            },
            orderBy: { display_order: 'asc' },
        });
    }
    getAllForAdmin(restaurantId) {
        return this.prisma.menuItem.findMany({
            where: { restaurantId },
            orderBy: [{ display_order: 'asc' }, { name: 'asc' }],
        });
    }
    createItem(dto) {
        return this.prisma.menuItem.create({
            data: {
                restaurantId: dto.restaurantId,
                categoryId: dto.categoryId,
                name: dto.name,
                description: dto.description,
                price: dto.price,
                image_url: dto.image_url,
                is_available: dto.is_available ?? true,
                display_order: dto.display_order ?? 0,
            },
        });
    }
    async updateItem(id, dto) {
        const updated = await this.prisma.menuItem
            .update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.description !== undefined && {
                    description: dto.description,
                }),
                ...(dto.price !== undefined && { price: dto.price }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.image_url !== undefined && { image_url: dto.image_url }),
                ...(dto.is_available !== undefined && {
                    is_available: dto.is_available,
                }),
                ...(dto.display_order !== undefined && {
                    display_order: dto.display_order,
                }),
            },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Menu item not found');
        });
        return updated;
    }
    async bulkUpdate(restaurantId, updates) {
        const results = await this.prisma.$transaction(updates.map((u) => this.prisma.menuItem.update({
            where: { id: u.id, restaurantId },
            data: u.data,
        })));
        return results;
    }
    deleteItem(id) {
        return this.prisma.menuItem.delete({ where: { id } }).catch(() => {
            throw new common_1.NotFoundException('Menu item not found');
        });
    }
    async toggleAvailability(id, is_available, userId) {
        const item = await this.prisma.menuItem
            .update({
            where: { id },
            data: { is_available },
        })
            .catch(() => {
            throw new common_1.NotFoundException('Menu item not found');
        });
        await this.auditService.logAction(item.restaurantId, userId, is_available ? 'Restore Menu Item' : '86 Menu Item', {
            itemId: item.id,
            itemName: item.name,
        });
        this.eventsGateway.emitToRestaurant(item.restaurantId, 'menuItem86d', {
            itemId: item.id,
            is_available: item.is_available,
        });
        return item;
    }
};
exports.MenuService = MenuService;
exports.MenuService = MenuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway,
        audit_service_1.AuditService])
], MenuService);
//# sourceMappingURL=menu.service.js.map