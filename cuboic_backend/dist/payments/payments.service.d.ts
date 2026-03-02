import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
export declare class PaymentsService {
    private paymentModel;
    constructor(paymentModel: Model<PaymentDocument>);
    findAll(restaurantId: string, from?: string, to?: string): import("mongoose").Query<(import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[], import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }, {}, PaymentDocument, "find", {}>;
    getSummary(restaurantId: string): Promise<{
        order_count: number;
        total_revenue: number;
    }>;
}
