import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryForecastService } from './inventory-forecast.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { StockInDto, StockAdjustDto } from './dto/stock-operations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly inventoryForecastService: InventoryForecastService,
  ) {}

  // ── AI Depletion & Restock Forecast ───────────────────────────────────────
  @Get('forecast')
  getForecast(
    @Query('outletId') outletId: string,
    @Query('historyDays') historyDays?: string,
  ) {
    const days = historyDays ? parseInt(historyDays, 10) : 60;
    return this.inventoryForecastService.getForecast(outletId, days);
  }

  // ── Items ────────────────────────────────────────────────────────────────
  @Post('items')
  create(@Body() dto: CreateInventoryItemDto) {
    return this.inventoryService.create(dto);
  }

  @Get('items')
  findAll(@Query('outletId') outletId: string) {
    return this.inventoryService.findAll(outletId);
  }

  @Get('items/low-stock')
  findLowStock(@Query('outletId') outletId: string) {
    return this.inventoryService.findLowStock(outletId);
  }

  @Get('items/:id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Patch('items/:id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<CreateInventoryItemDto>,
  ) {
    return this.inventoryService.update(id, body);
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Patch('items/bulk')
  bulkUpdate(
    @Query('outletId') outletId: string,
    @Body() body: Array<{ id: string; data: Partial<CreateInventoryItemDto> }>,
  ) {
    return this.inventoryService.bulkUpdate(outletId, body);
  }

  // ── Stock Operations ─────────────────────────────────────────────────────
  @Post('items/:id/stock-in')
  stockIn(@Param('id') id: string, @Body() dto: StockInDto) {
    return this.inventoryService.stockIn(id, dto);
  }

  @Post('items/:id/adjust')
  adjust(@Param('id') id: string, @Body() dto: StockAdjustDto) {
    return this.inventoryService.adjust(id, dto);
  }

  // ── Availability Check ───────────────────────────────────────────────────
  @Post('check-availability')
  checkAvailability(
    @Body()
    body: {
      outletId: string;
      items: Array<{ itemId: string; quantity: number }>;
    },
  ) {
    return this.inventoryService.checkAvailability(body.outletId, body.items);
  }
}
