"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dns_1 = require("dns");
(0, dns_1.setDefaultResultOrder)('ipv4first');
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const system_alert_filter_1 = require("./common/filters/system-alert.filter");
const admin_service_1 = require("./admin/admin.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const adminService = app.get(admin_service_1.AdminService);
    app.useGlobalFilters(new system_alert_filter_1.AllExceptionsFilter(adminService));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Outlet-Id'],
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port);
    console.log(`🚀 Thambi backend running on http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map