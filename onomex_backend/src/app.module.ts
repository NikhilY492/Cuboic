import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import Keyv from 'keyv';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';
import { RobotsModule } from './robots/robots.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { PaymentsModule } from './payments/payments.module';
import { UsersModule } from './users/users.module';
import { TelemetryModule } from './telemetry/telemetry.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { RobotRuntimeModule } from './robot-runtime/robot-runtime.module';
import { RobotWebRtcModule } from './robot-webrtc/robot-webrtc.module';
import { HealthModule } from './health/health.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TablesModule } from './tables/tables.module';
import { CustomersModule } from './customers/customers.module';
import { PlatformFeesModule } from './platform-fees/platform-fees.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { OutletsModule } from './outlets/outlets.module';
import { InventoryModule } from './inventory/inventory.module';
import { RecipesModule } from './recipes/recipes.module';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { UploadModule } from './upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrintersModule } from './printers/printers.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        stores: [
          new Keyv({
            store: createKeyv(`redis://${configService.get('REDIS_HOST', 'localhost')}:${configService.get('REDIS_PORT', '6379')}`),
          }),
        ],
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    MenuModule,
    CategoriesModule,
    OrdersModule,
    RobotsModule,
    DeliveriesModule,
    PaymentsModule,
    UsersModule,
    TelemetryModule,
    AuthModule,
    EventsModule,
    RestaurantsModule,
    RobotRuntimeModule,
    RobotWebRtcModule,
    HealthModule,
    ScheduleModule.forRoot(),
    TablesModule,
    CustomersModule,
    PlatformFeesModule,
    AnalyticsModule,
    OutletsModule,
    InventoryModule,
    RecipesModule,
    AdminModule,
    AuditModule,
    UploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    EventEmitterModule.forRoot(),
    PrintersModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
