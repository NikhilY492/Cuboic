import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    getSummary(restaurantId: string): Promise<{
        pending: number;
        preparing: number;
        completed: number;
    }>;
    getUnpaidSummary(restaurantId: string, customerId?: string, sessionId?: string, phone?: string): Promise<{
        count: number;
        total: number;
        orderIds: string[];
    }>;
    getUnpaidGroups(restaurantId: string): Promise<any[]>;
    checkSession(restaurantId: string, tableId: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        restaurantId: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
    }>;
    closeSession(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        restaurantId: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
    }>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(restaurantId: string, status?: string): import("@prisma/client").Prisma.PrismaPromise<({
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    updateTable(id: string, tableId: string): Promise<{
        id: string;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    cancelOrder(id: string): Promise<{
        id: string;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    confirmDelivery(id: string): Promise<{
        id: string;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markAsPaid(id: string): Promise<{
        table: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
        };
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
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
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string;
        outletId: string | null;
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markPaidBulk(restaurantId: string, orderIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
}
