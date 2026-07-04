import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('restaurant/:id')
  getRestaurantSettings(@Param('id') id: string) {
    return this.settingsService.getRestaurantSettings(id);
  }

  @Patch('restaurant/:id')
  updateRestaurantSettings(
    @Param('id') id: string,
    @Body() updateSettingsDto: UpdateSettingsDto,
  ) {
    return this.settingsService.updateRestaurantSettings(id, updateSettingsDto);
  }

  @Get('restaurant/:id/outlets')
  getOutlets(@Param('id') id: string) {
    return this.settingsService.getOutlets(id);
  }

  @Patch('outlet/:id')
  updateOutlet(@Param('id') id: string, @Body() data: any) {
    return this.settingsService.updateOutlet(id, data);
  }
}
