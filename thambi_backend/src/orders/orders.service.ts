import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';
import { PlatformFeesService } from '../platform-fees/platform-fees.service';
import { InventoryService } from '../inventory/inventory.service';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);

    constructor(
        private prisma: PrismaService,
        private readonly eventsGateway: EventsGateway,
        private readonly platformFeesService: PlatformFeesService,
        private readonly inventoryService: InventoryService,
        private readonly auditService: AuditService,
        private readonly usersService: UsersService,
    ) { }

    async getOrCreateSession(restaurantId: string, tableId: string) {
        // Find active session for this table
        let session = await this.prisma.tableSession.findFirst({
            where: {
                restaurantId,
                tableId,
                status: 'Active',
            },
            orderBy: { createdAt: 'desc' }
        });

        const now = new Date();

        if (session) {
            // Check for expiry (90 mins of inactivity)
            const lastActivity = new Date(session.lastActivityAt);
            const diffMins = (now.getTime() - lastActivity.getTime()) / (1000 * 60);

            if (diffMins > 90) {
                this.logger.log(`Session ${session.id} expired due to inactivity (${diffMins.toFixed(1)} mins)`);
                await this.prisma.tableSession.update({
                    where: { id: session.id },
                    data: { status: 'Expired' },
                });
                session = null;
            }
        }

        if (!session) {
            session = await this.prisma.tableSession.create({
                data: {
                    restaurantId,
                    tableId,
                    status: 'Active',
                    lastActivityAt: now,
                },
            });
        } else {
            // Update last activity on every access/order
            await this.prisma.tableSession.update({
                where: { id: session.id },
                data: { lastActivityAt: now },
            });
        }

        return session;
    }

    async closeSession(sessionId: string) {
        return this.prisma.tableSession.update({
            where: { id: sessionId },
            data: { 
                status: 'Closed',
                closedAt: new Date()
            },
        });
    }

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
                sessionId: dto.orderType === 'Takeaway' ? null : (await this.getOrCreateSession(dto.restaurantId, dto.tableId)).id,
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
            include: { table: true, payment: true, customer: true }
        });
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async updateTable(id: string, tableId: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { tableId },
            include: { table: true, payment: true, customer: true }
        });
        if (!order) throw new NotFoundException('Order not found');
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    private async hasPermission(userId: string, permission: string, defaultRoles: string[]): Promise<boolean> {
        const user = await this.usersService.findById(userId);
        if (!user) return false;
        
        // Owner always has access
        if (user.role === 'Owner') return true;

        // Check if user has dynamically configured permission
        const config = user.dashboard_config as string[];
        if (config && config.includes(permission)) return true;

        // Fallback to default matrix
        return defaultRoles.includes(user.role);
    }

    async cancelOrder(id: string, userId?: string) {
        const existing = await this.prisma.order.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Order not found');

        if (userId) {
            const hasAccess = await this.hasPermission(userId, 'CancelOrders', ['Captain', 'Manager', 'Owner']);
            if (!hasAccess) {
                throw new BadRequestException('You do not have permission to cancel orders');
            }

            const cancellableStates = ['Pending', 'Confirmed', 'Preparing'];
            if (!cancellableStates.includes(existing.status)) {
                throw new BadRequestException(`Order cannot be cancelled in state: ${existing.status}`);
            }
        } else {
            // Customer cancellation
            if (existing.status !== 'Pending') {
                throw new BadRequestException('Customers can only cancel pending orders');
            }
        }

        const order = await this.prisma.order.update({
            where: { id },
            data: { status: 'Cancelled' },
            include: { table: true, payment: true, customer: true }
        });
        
        if (userId) {
            await this.auditService.logAction(order.restaurantId, userId, 'Cancel Order', { orderId: order.id, status: existing.status });
        }
        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async updateItems(id: string, newItems: Array<{ itemId: string; quantity: number }>, userId: string, notes?: string) {
        const hasAccess = await this.hasPermission(userId, 'ModifyOrders', ['Captain', 'Manager', 'Owner']);
        if (!hasAccess) {
            throw new BadRequestException('You do not have permission to modify orders');
        }

        const existing = await this.prisma.order.findUnique({ where: { id } });
        if (!existing) throw new NotFoundException('Order not found');

        const modifiableStates = ['Pending', 'Confirmed', 'Preparing'];
        if (!modifiableStates.includes(existing.status)) {
            throw new BadRequestException(`Order items cannot be modified in state: ${existing.status}`);
        }

        // Refund existing inventory (if outletId present)
        const oldItems = Array.isArray(existing.items) ? (existing.items as any[]) : [];
        if (existing.outletId && oldItems.length > 0) {
            try {
                await this.inventoryService.refundForOrder(
                    existing.outletId,
                    id,
                    oldItems.map(i => ({ itemId: i.itemId, quantity: i.quantity }))
                );
            } catch (e) {
                this.logger.warn(`Failed to refund inventory for modified order ${id}: ${e.message}`);
            }
        }

        // Fetch prices for new items
        const itemDocs = await this.prisma.menuItem.findMany({
            where: { id: { in: newItems.map((i) => i.itemId) } },
        });

        if (itemDocs.length !== newItems.length) {
            throw new BadRequestException('One or more menu items not found');
        }

        const orderItems = newItems.map((i) => {
            const doc = itemDocs.find((d) => d.id === i.itemId);
            return { itemId: doc!.id, name: doc!.name, unitPrice: doc!.price, quantity: i.quantity };
        });

        const subtotal = orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
        const tax = 0;
        const total = parseFloat((subtotal + tax).toFixed(2));

        // Deduct inventory for new items
        if (existing.outletId && orderItems.length > 0) {
            try {
                await this.inventoryService.deductForOrder(
                    existing.outletId,
                    id,
                    orderItems.map(i => ({ itemId: i.itemId, quantity: i.quantity }))
                );
            } catch (e) {
                this.logger.warn(`Failed to deduct inventory for modified order ${id}: ${e.message}`);
            }
        }

        // Update Order
        const order = await this.prisma.order.update({
            where: { id },
            data: {
                items: orderItems,
                subtotal,
                tax,
                total,
                ...(notes !== undefined ? { notes } : {})
            },
            include: { table: true, payment: true, customer: true }
        });

        // Update Payment if exists
        if (order.payment) {
            await this.prisma.payment.update({
                where: { id: order.payment.id },
                data: { amount: total }
            });
            order.payment.amount = total;
        }

        await this.auditService.logAction(order.restaurantId, userId, 'Modify Order Items', { 
            orderId: order.id, 
            oldTotal: existing.total, 
            newTotal: total 
        });

        this.eventsGateway.emitToRestaurant(order.restaurantId, 'order:updated', order);
        return order;
    }

    async confirmDelivery(id: string) {
        const order = await this.prisma.order.update({
            where: { id },
            data: { status: 'Delivered' },
            include: { table: true, payment: true, customer: true }
        });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async markAsPaid(id: string, userId: string) {
        const hasAccess = await this.hasPermission(userId, 'SettlePayments', ['Captain', 'Cashier', 'Manager', 'Owner']);
        if (!hasAccess) {
            throw new BadRequestException('You do not have permission to mark orders as paid');
        }

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
        
        await this.auditService.logAction(order.restaurantId, userId, 'Mark Paid', { orderId: order.id, amount: order.total });
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
            include: { payment: true, customer: true, table: true, session: true },
        });

        // Group by customer_session_id
        const groups: Record<string, any> = {};

        for (const order of unpaidOrders) {
            const gid = order.sessionId || order.customer_session_id;
            if (!groups[gid]) {
                groups[gid] = {
                    sessionId: gid,
                    dbSessionId: order.sessionId,
                    sessionStatus: order.session?.status,
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

    async markPaidBulk(restaurantId: string, orderIds: string[], userId: string) {
        if (!orderIds || orderIds.length === 0) return { success: true, count: 0 };

        const hasAccess = await this.hasPermission(userId, 'SettlePayments', ['Captain', 'Cashier', 'Manager', 'Owner']);
        if (!hasAccess) {
            throw new BadRequestException('You do not have permission to settle payments');
        }

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

        const totalAmount = updatedOrders.reduce((sum, o) => sum + o.total, 0);
        await this.auditService.logAction(restaurantId, userId, 'Settle Payment Bulk', { orderIds, count: updatedOrders.length, totalAmount });

        for (const order of updatedOrders) {
            this.eventsGateway.emitToRestaurant(restaurantId, 'order:updated', order);
        }

        // Check if any sessions should be closed (if all their orders are now paid)
        const sessionIds = [...new Set(updatedOrders.map(o => o.sessionId).filter(Boolean))];
        for (const sid of sessionIds) {
            const unpaidCount = await this.prisma.order.count({
                where: {
                    sessionId: sid,
                    payment: { status: 'Pending' }
                }
            });
            if (unpaidCount === 0) {
                await this.closeSession(sid!);
                this.logger.log(`Session ${sid} closed as all orders are paid.`);
            }
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
            
            // Delete associated platform fees
            await this.prisma.platformFee.deleteMany({
                where: { orderId: { in: orderIds } },
            });

            // Delete the orders
            const deleted = await this.prisma.order.deleteMany({
                where: { id: { in: orderIds } },
            });

            this.logger.log(`Cleanup complete: Deleted ${deleted.count} stale pending order(s).`);

            // Also expire old sessions that are still marked as 'Active' but inactive for > 2 hours
            const sessionCutoff = new Date(Date.now() - 120 * 60 * 1000);
            const expiredSessions = await this.prisma.tableSession.updateMany({
                where: {
                    status: 'Active',
                    lastActivityAt: { lt: sessionCutoff }
                },
                data: { status: 'Expired' }
            });
            if (expiredSessions.count > 0) {
                this.logger.log(`Cleanup: Marked ${expiredSessions.count} inactive sessions as Expired.`);
            }
        } catch (error) {
            this.logger.error('Error during stale orders cleanup:', error);
        }
    }
}
