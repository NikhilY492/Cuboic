import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PlatformFeesService } from '../platform-fees/platform-fees.service';
import { InventoryService } from '../inventory/inventory.service';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
export declare class OrdersService {
    private prisma;
    private readonly eventsGateway;
    private readonly platformFeesService;
    private readonly inventoryService;
    private readonly auditService;
    private readonly usersService;
    private readonly logger;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway, platformFeesService: PlatformFeesService, inventoryService: InventoryService, auditService: AuditService, usersService: UsersService);
    private checkVersion;
    getOrCreateSession(restaurantId: string, tableId: string): Promise<{
        id: string;
        createdAt: Date;
        restaurantId: string;
        status: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
    }>;
    closeSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        restaurantId: string;
        status: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
    }>;
    create(dto: CreateOrderDto): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(restaurantId: string, status?: string): import("@prisma/client").Prisma.PrismaPromise<({
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    })[]>;
    getSummary(restaurantId: string): Promise<{
        pending: number;
        preparing: number;
        completed: number;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    updateTable(id: string, tableId: string): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    private hasPermission;
    cancelOrder(id: string, userId?: string, incomingVersion?: number): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    updateItems(id: string, newItems: Array<{
        itemId: string;
        quantity: number;
    }>, userId: string, notes?: string, incomingVersion?: number): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    mergeOrders(targetOrderId: string, sourceOrderIds: string[], userId?: string, incomingVersion?: number): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markItemsDelivered(id: string, itemIds: string[]): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    confirmDelivery(id: string): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markAsPaid(id: string, userId: string): Promise<{
        table: {
            id: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            restaurantId: string;
        };
        customer: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.PaymentStatus;
            amount: number;
            orderId: string;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        status: import("@prisma/client").$Enums.OrderStatus;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        version: number;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    getUnpaidSummary(restaurantId: string, customerId?: string, sessionId?: string, customerPhone?: string): Promise<{
        count: number;
        total: number;
        orderIds: string[];
    }>;
    getUnpaidGroups(restaurantId: string): Promise<{
        sessionId: string | null;
        dbSessionId: string | null;
        sessionStatus?: string;
        customerId: string | null;
        customer: any;
        table: any;
        total: number;
        count: number;
        orderIds: string[];
        lastOrderAt: Date;
    }[]>;
    markPaidBulk(restaurantId: string, orderIds: string[], userId: string): Promise<{
        success: boolean;
        count: number;
    }>;
    cleanupStaleOrders(): Promise<void>;
}
