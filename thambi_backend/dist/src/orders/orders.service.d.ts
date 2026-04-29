import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PlatformFeesService } from '../platform-fees/platform-fees.service';
import { InventoryService } from '../inventory/inventory.service';
export declare class OrdersService {
    private prisma;
    private readonly eventsGateway;
    private readonly platformFeesService;
    private readonly inventoryService;
    private readonly logger;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway, platformFeesService: PlatformFeesService, inventoryService: InventoryService);
    getOrCreateSession(restaurantId: string, tableId: string): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: string;
        lastActivityAt: Date;
        createdAt: Date;
        closedAt: Date | null;
    }>;
    closeSession(sessionId: string): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: string;
        lastActivityAt: Date;
        createdAt: Date;
        closedAt: Date | null;
    }>;
    create(dto: CreateOrderDto): Promise<{
        table: {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            method: string;
            transaction_id: string | null;
            orderId: string;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        table: {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            method: string;
            transaction_id: string | null;
            orderId: string;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(restaurantId: string, status?: string): import("@prisma/client").Prisma.PrismaPromise<({
        table: {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            method: string;
            transaction_id: string | null;
            orderId: string;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    })[]>;
    getSummary(restaurantId: string): Promise<{
        pending: number;
        preparing: number;
        completed: number;
    }>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    updateTable(id: string, tableId: string): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    cancelOrder(id: string): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    confirmDelivery(id: string): Promise<{
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markAsPaid(id: string): Promise<{
        table: {
            id: string;
            restaurantId: string;
            createdAt: Date;
            updatedAt: Date;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            name: string;
            updatedAt: Date;
            phone: string;
        } | null;
        payment: {
            id: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            method: string;
            transaction_id: string | null;
            orderId: string;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        tableId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        notes: string | null;
        updatedAt: Date;
        outletId: string | null;
        sessionId: string | null;
        customerId: string | null;
    }>;
    getUnpaidSummary(restaurantId: string, customerId?: string, sessionId?: string, customerPhone?: string): Promise<{
        count: number;
        total: number;
        orderIds: string[];
    }>;
    getUnpaidGroups(restaurantId: string): Promise<any[]>;
    markPaidBulk(restaurantId: string, orderIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
    cleanupStaleOrders(): Promise<void>;
}
