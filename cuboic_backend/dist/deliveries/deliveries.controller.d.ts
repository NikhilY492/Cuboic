import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
export declare class DeliveriesController {
    private readonly deliveriesService;
    constructor(deliveriesService: DeliveriesService);
    create(dto: CreateDeliveryDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findActive(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/delivery.schema").DeliveryDocument, "find", {}>;
    findAll(restaurantId: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, import("./schemas/delivery.schema").DeliveryDocument, "find", {}>;
    confirmStop(id: string, index: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/delivery.schema").DeliveryDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/delivery.schema").Delivery & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
