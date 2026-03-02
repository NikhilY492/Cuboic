import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) { }

    findAll(restaurantId: string, from?: string, to?: string) {
        const filter: any = { restaurant_id: new Types.ObjectId(restaurantId) };
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }
        return this.paymentModel.find(filter).sort({ createdAt: -1 });
    }

    async getSummary(restaurantId: string) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todayPayments = await this.paymentModel.find({
            restaurant_id: new Types.ObjectId(restaurantId),
            status: 'Paid',
            createdAt: { $gte: start, $lte: end },
        });

        const total_revenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);
        return { order_count: todayPayments.length, total_revenue };
    }
}
