import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { MenuItem, MenuItemDocument } from '../menu/schemas/menu-item.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const TAX_RATE = 0.05;

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItemDocument>,
        private readonly eventsGateway: EventsGateway,
    ) { }

    async create(dto: CreateOrderDto) {
        const itemDocs = await this.menuItemModel.find({
            _id: { $in: dto.items.map((i) => new Types.ObjectId(i.item_id)) },
        });

        if (itemDocs.length !== dto.items.length) {
            throw new BadRequestException('One or more menu items not found');
        }

        const orderItems = dto.items.map((i) => {
            const doc = itemDocs.find((d) => d._id.toString() === i.item_id);
            return { item_id: doc!._id, name: doc!.name, unit_price: doc!.price, quantity: i.quantity };
        });

        const subtotal = orderItems.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
        const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
        const total = parseFloat((subtotal + tax).toFixed(2));

        const order = await this.orderModel.create({
            restaurant_id: new Types.ObjectId(dto.restaurant_id),
            table_id: new Types.ObjectId(dto.table_id),
            customer_session_id: dto.customer_session_id,
            items: orderItems,
            subtotal,
            tax,
            total,
        });

        this.eventsGateway.emitToRestaurant(dto.restaurant_id, 'order:new', order);
        return order;
    }

    findOne(id: string) {
        return this.orderModel.findById(id);
    }

    findAll(restaurantId: string, status?: string) {
        const filter: any = { restaurant_id: new Types.ObjectId(restaurantId) };
        if (status) filter.status = status;
        return this.orderModel.find(filter).sort({ createdAt: -1 });
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.orderModel.findByIdAndUpdate(
            id,
            { status: dto.status },
            { new: true },
        );
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurant_id.toString(), 'order:updated', order);
        return order;
    }

    async confirmDelivery(id: string) {
        const order = await this.orderModel.findByIdAndUpdate(
            id,
            { status: 'Delivered' },
            { new: true },
        );
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
