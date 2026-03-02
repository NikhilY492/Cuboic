import { Model, Types } from 'mongoose';
import { Delivery, DeliveryDocument } from './schemas/delivery.schema';
import { RobotDocument } from '../robots/schemas/robot.schema';
import { OrderDocument } from '../orders/schemas/order.schema';
import { EventsGateway } from '../events/events.gateway';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
export declare class DeliveriesService {
    private deliveryModel;
    private robotModel;
    private orderModel;
    private readonly eventsGateway;
    constructor(deliveryModel: Model<DeliveryDocument>, robotModel: Model<RobotDocument>, orderModel: Model<OrderDocument>, eventsGateway: EventsGateway);
    create(dto: CreateDeliveryDto): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findActive(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, DeliveryDocument, "find", {}>;
    findAll(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, DeliveryDocument, "find", {}>;
    confirmStop(deliveryId: string, stopIndex: number): Promise<import("mongoose").Document<unknown, {}, DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & Delivery & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
