import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Delivery, DeliveryDocument } from './schemas/delivery.schema';
import { Robot, RobotDocument } from '../robots/schemas/robot.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveriesService {
    constructor(
        @InjectModel(Delivery.name) private deliveryModel: Model<DeliveryDocument>,
        @InjectModel(Robot.name) private robotModel: Model<RobotDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        private readonly eventsGateway: EventsGateway,
    ) { }

    async create(dto: CreateDeliveryDto) {
        const robot = await this.robotModel.findById(dto.robot_id);
        if (!robot) throw new NotFoundException('Robot not found');
        if (robot.status !== 'Idle') throw new BadRequestException('Robot is not idle');

        const allCabinets = dto.stops.flatMap((s) => s.cabinets);
        const unique = new Set(allCabinets);
        if (unique.size !== allCabinets.length) {
            throw new ConflictException('Duplicate cabinet IDs across stops');
        }

        for (const cabId of allCabinets) {
            const cab = robot.cabinets.find((c) => c.id === cabId);
            if (!cab) throw new BadRequestException(`Cabinet ${cabId} not found on robot`);
            if (cab.status === 'Occupied') throw new ConflictException(`Cabinet ${cabId} is occupied`);
        }

        // Update robot status + cabinets
        robot.status = 'Delivering';
        for (const cab of robot.cabinets) {
            if (allCabinets.includes(cab.id)) cab.status = 'Occupied';
        }
        await robot.save();

        // Update orders to Assigned
        await this.orderModel.updateMany(
            { _id: { $in: dto.stops.map((s) => new Types.ObjectId(s.order_id)) } },
            { status: 'Assigned' },
        );

        const delivery = await this.deliveryModel.create({
            restaurant_id: new Types.ObjectId(dto.restaurant_id),
            robot_id: new Types.ObjectId(dto.robot_id),
            stops: dto.stops.map((s) => ({
                order_id: new Types.ObjectId(s.order_id),
                table_id: new Types.ObjectId(s.table_id),
                cabinets: s.cabinets,
                sequence: s.sequence,
                status: 'Pending',
            })),
        });

        this.eventsGateway.emitToRestaurant(dto.restaurant_id, 'delivery:started', delivery);
        return delivery;
    }

    findActive(restaurantId: string) {
        return this.deliveryModel.find({
            restaurant_id: new Types.ObjectId(restaurantId),
            status: 'InTransit',
        });
    }

    findAll(restaurantId: string) {
        return this.deliveryModel
            .find({ restaurant_id: new Types.ObjectId(restaurantId) })
            .sort({ createdAt: -1 });
    }

    async confirmStop(deliveryId: string, stopIndex: number) {
        const delivery = await this.deliveryModel.findById(deliveryId);
        if (!delivery) throw new NotFoundException('Delivery not found');

        const stop = delivery.stops[stopIndex];
        if (!stop) throw new NotFoundException('Stop not found');
        if (stop.status === 'Delivered') throw new BadRequestException('Stop already confirmed');

        stop.status = 'Delivered';
        stop.delivered_at = new Date();

        // Update the order
        await this.orderModel.findByIdAndUpdate(stop.order_id, { status: 'Delivered' });

        // Free cabinets
        const robot = await this.robotModel.findById(delivery.robot_id);
        if (robot) {
            for (const cab of robot.cabinets) {
                if (stop.cabinets.includes(cab.id)) cab.status = 'Free';
            }

            // Check if all stops done
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
}
