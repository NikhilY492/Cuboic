import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { Delivery, DeliverySchema } from './schemas/delivery.schema';
import { Robot, RobotSchema } from '../robots/schemas/robot.schema';
import { Order, OrderSchema } from '../orders/schemas/order.schema';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Delivery.name, schema: DeliverySchema },
            { name: Robot.name, schema: RobotSchema },
            { name: Order.name, schema: OrderSchema },
        ]),
        EventsModule,
    ],
    controllers: [DeliveriesController],
    providers: [DeliveriesService],
})
export class DeliveriesModule { }
