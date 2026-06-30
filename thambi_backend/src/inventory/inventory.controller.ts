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
  Req,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { StockInDto, StockAdjustDto } from './dto/stock-operations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

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
findOne(@Param('id') id: string, @Req() req: any) {
  return this.inventoryService.findOne(id, req.user.outletId);
}

  @Patch('items/:id')
update(
  @Param('id') id: string,
  @Body() body: Partial<CreateInventoryItemDto>,
  @Req() req: any,
) {
  return this.inventoryService.update(id, req.user.outletId, body);
}

  @Delete('items/:id')
remove(@Param('id') id: string, @Req() req: any) {
  return this.inventoryService.remove(id, req.user.outletId);
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
stockIn(
  @Param('id') id: string,
  @Body() dto: StockInDto,
  @Req() req: any,
) {
  return this.inventoryService.stockIn(id, req.user.outletId, dto);
}

  @Post('items/:id/adjust')
adjust(
  @Param('id') id: string,
  @Body() dto: StockAdjustDto,
  @Req() req: any,
) {
  return this.inventoryService.adjust(id, req.user.outletId, dto);
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
