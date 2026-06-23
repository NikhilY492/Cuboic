import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/system-alert.filter';
import { AdminService } from './admin/admin.service';
import helmet from 'helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const adminService = app.get(AdminService);
  app.useGlobalFilters(new AllExceptionsFilter(adminService));

  app.enableCors({
    origin: [
      'https://thambi.in',
      'https://admin.thambi.in',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Outlet-Id'],
  });
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Thambi backend running on http://localhost:${port}`);
}
bootstrap();
