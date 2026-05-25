import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RobotWebRtcGateway } from './robot-webrtc.gateway';
import { RobotsModule } from '../robots/robots.module';
import { RobotRuntimeModule } from '../robot-runtime/robot-runtime.module';

@Module({
  imports: [
    RobotsModule,          // RobotsService — auth checks for robot + viewer
    RobotRuntimeModule,    // RobotRuntimeService — online/offline state
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
      }),
    }),
  ],
  providers: [RobotWebRtcGateway],
})
export class RobotWebRtcModule {}
