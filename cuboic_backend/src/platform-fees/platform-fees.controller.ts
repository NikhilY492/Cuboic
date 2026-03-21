import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { PlatformFeesService } from './platform-fees.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Owner')
@Controller('platform-fees')
export class PlatformFeesController {
    constructor(private readonly platformFeesService: PlatformFeesService) { }

    @Get()
    findAll(@Query('restaurantId') restaurantId: string) {
        return this.platformFeesService.findAll(restaurantId);
    }

    @Get('summary')
    getSummary(@Query('restaurantId') restaurantId: string) {
        return this.platformFeesService.getSummary(restaurantId);
    }

    @Patch(':id/pay')
    markAsPaid(@Param('id') id: string) {
        return this.platformFeesService.markAsPaid(id);
    }
}
