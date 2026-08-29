import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryConsumptionService } from './inventory-consumption.service';
import { InventoryForecastService } from './inventory-forecast.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [InventoryController],
  providers: [
    InventoryService,
    InventoryConsumptionService,
    InventoryForecastService,
  ],
  exports: [
    InventoryService,
    InventoryConsumptionService,
    InventoryForecastService,
  ],
})
export class InventoryModule {}
