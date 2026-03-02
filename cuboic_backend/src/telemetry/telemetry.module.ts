import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    RobotTelemetry,
    RobotTelemetrySchema,
} from './schemas/robot-telemetry.schema';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: RobotTelemetry.name, schema: RobotTelemetrySchema },
        ]),
    ],
    controllers: [TelemetryController],
    providers: [TelemetryService],
    exports: [TelemetryService], // 🔥 REQUIRED
})
export class TelemetryModule { }