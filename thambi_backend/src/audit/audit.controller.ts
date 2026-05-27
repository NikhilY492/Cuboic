import { Controller, Get, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) {}

    @Get()
    async findAll(@Query('restaurantId') restaurantId: string) {
        if (!restaurantId) {
            return [];
        }
        return this.auditService.findAll(restaurantId);
    }
}
