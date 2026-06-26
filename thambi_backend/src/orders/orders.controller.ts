import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Get('summary')
  getSummary(@Req() req: any) {
    return this.ordersService.getSummary(req.user.restaurantId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Get('unpaid-summary')
  getUnpaidSummary(
    @Req() req: any,
    @Query('customerId') customerId?: string,
    @Query('sessionId') sessionId?: string,
    @Query('phone') phone?: string,
  ) {
    return this.ordersService.getUnpaidSummary(
      req.user.restaurantId,
      customerId,
      sessionId,
      phone,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Get('unpaid-groups')
  getUnpaidGroups(@Req() req: any) {
    return this.ordersService.getUnpaidGroups(req.user.restaurantId);
  }

  @Get('check-session')
  checkSession(
    @Query('restaurantId') restaurantId: string,
    @Query('tableId') tableId: string,
  ) {
    return this.ordersService.getOrCreateSession(restaurantId, tableId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Patch('session/:id/close')
  closeSession(@Param('id') id: string) {
    return this.ordersService.closeSession(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Staff', 'Owner', 'Admin', 'Manager')
@Get(':id')
findOne(@Param('id') id: string, @Req() req: any) {
  return this.ordersService.findOne(id, req.user.restaurantId);
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Get()
  findAll(@Req() req: any, @Query('status') status?: string) {
    return this.ordersService.findAll(req.user.restaurantId, status);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Manager', 'Captain')
  @Post('merge')
  mergeOrders(
    @Body()
    body: { targetOrderId: string; sourceOrderIds: string[]; version?: number },
    @Req() req: any,
  ) {
    return this.ordersService.mergeOrders(
      body.targetOrderId,
      body.sourceOrderIds,
      req.user?.sub,
      body.version,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Patch(':id/table')
  updateTable(@Param('id') id: string, @Body('tableId') tableId: string) {
    return this.ordersService.updateTable(id, tableId);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch(':id/cancel')
  cancelOrder(
    @Param('id') id: string,
    @Body('version') version: number | undefined,
    @Req() req: any,
  ) {
    return this.ordersService.cancelOrder(id, req.user?.sub, version);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Patch(':id/items')
  updateItems(
    @Param('id') id: string,
    @Body('items') items: Array<{ itemId: string; quantity: number }>,
    @Body('notes') notes: string | undefined,
    @Body('version') version: number | undefined,
    @Req() req: any,
  ) {
    return this.ordersService.updateItems(
      id,
      items,
      req.user.sub,
      notes,
      version,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Patch(':id/confirm')
confirmDelivery(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.ordersService.confirmDelivery(
    id,
    req.user.restaurantId,
  );
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Waiter')
  @Patch(':id/deliver-items')
  deliverItems(
  @Param('id') id: string,
  @Body('itemIds') itemIds: string[],
  @Req() req: any,
) {
  return this.ordersService.markItemsDelivered(
    id,
    itemIds,
    req.user.restaurantId,
  );
}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner')
  @Patch(':id/pay')
  markAsPaid(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.markAsPaid(id, req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Staff', 'Owner', 'Admin', 'Manager')
  @Patch('mark-paid-bulk')
  markPaidBulk(@Body('orderIds') orderIds: string[], @Req() req: any) {
    return this.ordersService.markPaidBulk(
      req.user.restaurantId,
      orderIds,
      req.user.sub,
    );
  }
}
