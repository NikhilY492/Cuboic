import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
import { PlatformFeesService } from '../platform-fees/platform-fees.service';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private prisma: PrismaService,
        private readonly eventsGateway: EventsGateway,
        private readonly platformFeesService: PlatformFeesService,
        private readonly inventoryService: InventoryService,
    ) { }

    async create(dto: CreateOrderDto) {
        console.log('[DEBUG] createOrder DTO:', JSON.stringify(dto, null, 2));
        const itemDocs = await this.prisma.menuItem.findMany({
            where: { id: { in: dto.items.map((i) => i.itemId) } },
        });

        if (itemDocs.length !== dto.items.length) {
            console.log('[DEBUG] itemDocs found:', itemDocs.map(d => d.id), 'but expected:', dto.items.map(i => i.itemId));
            throw new BadRequestException('One or more menu items not found');
        }

        const orderItems = dto.items.map((i) => {
            const doc = itemDocs.find((d) => d.id === i.itemId);
            return { itemId: doc!.id, name: doc!.name, unitPrice: doc!.price, quantity: i.quantity };
        });

        const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const tax = 0;
        const total = parseFloat((subtotal + tax).toFixed(2));

        const order = await this.prisma.order.create({
            data: {
                restaurantId: dto.restaurantId,
                outletId: dto.outletId,
                tableId: dto.tableId,
                customerId: dto.customerId,
                customer_session_id: dto.customerSessionId,
                orderType: dto.orderType || 'DineIn',
                notes: dto.notes,
                items: orderItems,
                subtotal,
                tax,
                total,
                payment: {
                    create: {
                        amount: total,
                        method: 'Counter',
                        status: (dto as any).paymentStatus || 'Pending',
                        transaction_id: `txn_${Date.now()}`
                    }
                }
            },
            include: { payment: true, customer: true, table: true }
        });

        this.eventsGateway.emitToRestaurant(dto.restaurantId, 'order:new', order);

        // Auto-create platform fee if order total > ₹100
        await this.platformFeesService.createIfEligible(dto.restaurantId, order.id, total);

        // Deduct inventory stock via Recipe Engine (only if outletId provided)
        if (dto.outletId) {
            try {
                await this.inventoryService.deductForOrder(
                    dto.outletId,
                    order.id,
                    dto.items.map((i) => ({ itemId: i.itemId, quantity: i.quantity })),
                );
            } catch (e) {
                this.logger.warn(`Inventory deduction failed for order ${order.id}: ${e.message}`);
            }
        }

        return order;
    }

    findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { table: true, payment: true, customer: true },
        });
    }

    findAll(restaurantId: string, status?: string) {
        return this.prisma.order.findMany({
            where: {
                restaurantId,
                ...(status ? { status: status as OrderStatus } : {}),
            },
            include: { table: true, payment: true, customer: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getSummary(restaurantId: string) {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const todayOrders = await this.prisma.order.findMany({
            where: {
                restaurantId,
                createdAt: { gte: start, lte: end },
            },
            select: { status: true },
        });

        // Tally up counts by state
        const summary = todayOrders.reduce(
            (acc, order) => {
                if (order.status === 'Pending') acc.pending++;
                if (order.status === 'Confirmed' || order.status === 'Preparing') acc.preparing++;
                if (order.status === 'Delivered') acc.completed++;
                return acc;
            },
            { pending: 0, preparing: 0, completed: 0 }
        );

        return summary;
    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: dto.status as OrderStatus },
        });
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async updateTable(id: string, tableId: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { tableId },
        });
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async cancelOrder(id: string) {
        const existing = await this.prisma.order.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Order not found');

        const cancellableStates = ['Pending', 'Confirmed', 'Preparing'];
        if (!cancellableStates.includes(existing.status)) {
            throw new BadRequestException(`Order cannot be cancelled in state: ${existing.status}`);
        }

        const order = await this.prisma.order.update({
            where: { id },
            data: { status: 'Cancelled' },
        });
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async confirmDelivery(id: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: 'Delivered' },
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async markAsPaid(id: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: {
                payment: {
                    update: { status: 'Paid' }
                }
            },
            include: { payment: true, table: true, customer: true }
        });
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async getUnpaidSummary(restaurantId: string, customerId?: string, sessionId?: string, customerPhone?: string) {
        if (!customerId && !sessionId && !customerPhone) {
            throw new BadRequestException('CustomerId, sessionId or customerPhone is required');
        }

        let resolvedCustomerId = customerId;
        if (customerPhone && !resolvedCustomerId) {
            const customer = await this.prisma.customer.findUnique({ where: { phone: customerPhone } });
            if (customer) resolvedCustomerId = customer.id;
        }

        const unpaidOrders = await this.prisma.order.findMany({
            where: {
                restaurantId,
                payment: { status: 'Pending' },
                OR: [
                    ...(resolvedCustomerId ? [{ customerId: resolvedCustomerId }] : []),
                    ...(sessionId ? [{ customer_session_id: sessionId }] : []),
                ],
                status: { not: 'Cancelled' }
            },
            include: { payment: true },
        });

        const totalUnpaid = unpaidOrders.reduce((sum, o) => sum + o.total, 0);
        return {
            count: unpaidOrders.length,
            total: totalUnpaid,
            orderIds: unpaidOrders.map(o => o.id),
        };
    }

    async getUnpaidGroups(restaurantId: string) {
        const unpaidOrders = await this.prisma.order.findMany({
            where: {
                restaurantId,
                payment: { status: 'Pending' },
                status: { not: 'Cancelled' }
            },
            include: { payment: true, customer: true, table: true },
        });

        // Group by customer_session_id
        const groups: Record<string, any> = {};

        for (const order of unpaidOrders) {
            const gid = order.customer_session_id;
            if (!groups[gid]) {
                groups[gid] = {
                    sessionId: gid,
                    customerId: order.customerId,
                    customer: order.customer,
                    table: order.table,
                    total: 0,
                    count: 0,
                    orderIds: [],
                    lastOrderAt: order.createdAt
                };
            }
            groups[gid].total += order.total;
            groups[gid].count += 1;
            groups[gid].orderIds.push(order.id);
            if (order.createdAt > groups[gid].lastOrderAt) {
                groups[gid].lastOrderAt = order.createdAt;
            }
        }

        return Object.values(groups).sort((a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime());
    }

    async markPaidBulk(restaurantId: string, orderIds: string[]) {
        if (!orderIds || orderIds.length === 0) return { success: true, count: 0 };

        await this.prisma.payment.updateMany({
            where: {
                orderId: { in: orderIds },
                order: { restaurantId }
            },
            data: { status: 'Paid' }
        });

        // Emit updates for each order to keep UI in sync
        const updatedOrders = await this.prisma.order.findMany({
            where: { id: { in: orderIds } },
            include: { payment: true, table: true, customer: true }
        });

        for (const order of updatedOrders) {
            this.eventsGateway.emitToRestaurant(restaurantId, 'order:updated', order);
        }

        return { success: true, count: updatedOrders.length };
    }

    @Cron(CronExpression.EVERY_HOUR)
    async cleanupStaleOrders() {
        this.logger.log('Running stale orders cleanup...');
        const cutoff = new Date(Date.now() - 8 * 60 * 60 * 1000); // 8 hours ago

        try {
            // Find all pending orders older than 8 hours
            const staleOrders = await this.prisma.order.findMany({
                where: {
                    status: 'Pending',
                    createdAt: { lt: cutoff },
                },
                select: { id: true },
            });

            if (staleOrders.length === 0) {
                this.logger.log('No stale orders to clean up.');
                return;
            }

            const orderIds = staleOrders.map(o => o.id);

            // Delete associated payments first (no cascade setup on DB currently)
            await this.prisma.payment.deleteMany({
                where: { orderId: { in: orderIds } },
            });

            // Delete the orders
            const deleted = await this.prisma.order.deleteMany({
                where: { id: { in: orderIds } },
            });

            this.logger.log(`Cleanup complete: Deleted ${deleted.count} stale pending order(s).`);
        } catch (error) {
            this.logger.error('Error during stale orders cleanup:', error);
        }
    }
}
