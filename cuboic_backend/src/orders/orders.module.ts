import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { MenuItem, MenuItemSchema } from '../menu/schemas/menu-item.schema';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema },
            { name: MenuItem.name, schema: MenuItemSchema },
        ]),
        EventsModule,
    ],
    controllers: [OrdersController],
    providers: [OrdersService],
    exports: [MongooseModule],
})
export class OrdersModule { }
