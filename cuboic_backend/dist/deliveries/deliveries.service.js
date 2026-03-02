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
exports.DeliveriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const delivery_schema_1 = require("./schemas/delivery.schema");
const robot_schema_1 = require("../robots/schemas/robot.schema");
const order_schema_1 = require("../orders/schemas/order.schema");
const events_gateway_1 = require("../events/events.gateway");
let DeliveriesService = class DeliveriesService {
    deliveryModel;
    robotModel;
    orderModel;
    eventsGateway;
    constructor(deliveryModel, robotModel, orderModel, eventsGateway) {
        this.deliveryModel = deliveryModel;
        this.robotModel = robotModel;
        this.orderModel = orderModel;
        this.eventsGateway = eventsGateway;
    }
    async create(dto) {
        const robot = await this.robotModel.findById(dto.robot_id);
        if (!robot)
            throw new common_1.NotFoundException('Robot not found');
        if (robot.status !== 'Idle')
            throw new common_1.BadRequestException('Robot is not idle');
        const allCabinets = dto.stops.flatMap((s) => s.cabinets);
        const unique = new Set(allCabinets);
        if (unique.size !== allCabinets.length) {
            throw new common_1.ConflictException('Duplicate cabinet IDs across stops');
        }
        for (const cabId of allCabinets) {
            const cab = robot.cabinets.find((c) => c.id === cabId);
            if (!cab)
                throw new common_1.BadRequestException(`Cabinet ${cabId} not found on robot`);
            if (cab.status === 'Occupied')
                throw new common_1.ConflictException(`Cabinet ${cabId} is occupied`);
        }
        robot.status = 'Delivering';
        for (const cab of robot.cabinets) {
            if (allCabinets.includes(cab.id))
                cab.status = 'Occupied';
        }
        await robot.save();
        await this.orderModel.updateMany({ _id: { $in: dto.stops.map((s) => new mongoose_2.Types.ObjectId(s.order_id)) } }, { status: 'Assigned' });
        const delivery = await this.deliveryModel.create({
            restaurant_id: new mongoose_2.Types.ObjectId(dto.restaurant_id),
            robot_id: new mongoose_2.Types.ObjectId(dto.robot_id),
            stops: dto.stops.map((s) => ({
                order_id: new mongoose_2.Types.ObjectId(s.order_id),
                table_id: new mongoose_2.Types.ObjectId(s.table_id),
                cabinets: s.cabinets,
                sequence: s.sequence,
                status: 'Pending',
            })),
        });
        this.eventsGateway.emitToRestaurant(dto.restaurant_id, 'delivery:started', delivery);
        return delivery;
    }
    findActive(restaurantId) {
        return this.deliveryModel.find({
            restaurant_id: new mongoose_2.Types.ObjectId(restaurantId),
            status: 'InTransit',
        });
    }
    findAll(restaurantId) {
        return this.deliveryModel
            .find({ restaurant_id: new mongoose_2.Types.ObjectId(restaurantId) })
            .sort({ createdAt: -1 });
    }
    async confirmStop(deliveryId, stopIndex) {
        const delivery = await this.deliveryModel.findById(deliveryId);
        if (!delivery)
            throw new common_1.NotFoundException('Delivery not found');
        const stop = delivery.stops[stopIndex];
        if (!stop)
            throw new common_1.NotFoundException('Stop not found');
        if (stop.status === 'Delivered')
            throw new common_1.BadRequestException('Stop already confirmed');
        stop.status = 'Delivered';
        stop.delivered_at = new Date();
        await this.orderModel.findByIdAndUpdate(stop.order_id, { status: 'Delivered' });
        const robot = await this.robotModel.findById(delivery.robot_id);
        if (robot) {
            for (const cab of robot.cabinets) {
                if (stop.cabinets.includes(cab.id))
                    cab.status = 'Free';
            }
            const allDone = delivery.stops.every((s) => s.status === 'Delivered');
            if (allDone) {
                delivery.status = 'Completed';
                robot.status = 'Idle';
            }
            await robot.save();
        }
        await delivery.save();
        this.eventsGateway.emitToRestaurant(delivery.restaurant_id.toString(), 'delivery:updated', delivery);
        return delivery;
    }
};
exports.DeliveriesService = DeliveriesService;
exports.DeliveriesService = DeliveriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(delivery_schema_1.Delivery.name)),
    __param(1, (0, mongoose_1.InjectModel)(robot_schema_1.Robot.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        events_gateway_1.EventsGateway])
], DeliveriesService);
//# sourceMappingURL=deliveries.service.js.map