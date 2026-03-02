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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const menu_item_schema_1 = require("../menu/schemas/menu-item.schema");
const events_gateway_1 = require("../events/events.gateway");
const TAX_RATE = 0.05;
let OrdersService = class OrdersService {
    orderModel;
    menuItemModel;
    eventsGateway;
    constructor(orderModel, menuItemModel, eventsGateway) {
        this.orderModel = orderModel;
        this.menuItemModel = menuItemModel;
        this.eventsGateway = eventsGateway;
    }
    async create(dto) {
        const itemDocs = await this.menuItemModel.find({
            _id: { $in: dto.items.map((i) => new mongoose_2.Types.ObjectId(i.item_id)) },
        });
        if (itemDocs.length !== dto.items.length) {
            throw new common_1.BadRequestException('One or more menu items not found');
        }
        const orderItems = dto.items.map((i) => {
            const doc = itemDocs.find((d) => d._id.toString() === i.item_id);
            return { item_id: doc._id, name: doc.name, unit_price: doc.price, quantity: i.quantity };
        });
        const subtotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
        const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
        const total = parseFloat((subtotal + tax).toFixed(2));
        const order = await this.orderModel.create({
            restaurant_id: new mongoose_2.Types.ObjectId(dto.restaurant_id),
            table_id: new mongoose_2.Types.ObjectId(dto.table_id),
            customer_session_id: dto.customer_session_id,
            items: orderItems,
            subtotal,
            tax,
            total,
        });
        this.eventsGateway.emitToRestaurant(dto.restaurant_id, 'order:new', order);
        return order;
    }
    findOne(id) {
        return this.orderModel.findById(id);
    }
    findAll(restaurantId, status) {
        const filter = { restaurant_id: new mongoose_2.Types.ObjectId(restaurantId) };
        if (status)
            filter.status = status;
        return this.orderModel.find(filter).sort({ createdAt: -1 });
    }
    async updateStatus(id, dto) {
        const order = await this.orderModel.findByIdAndUpdate(id, { status: dto.status }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurant_id.toString(), 'order:updated', order);
        return order;
    }
    async confirmDelivery(id) {
        const order = await this.orderModel.findByIdAndUpdate(id, { status: 'Delivered' }, { new: true });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(menu_item_schema_1.MenuItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        events_gateway_1.EventsGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map