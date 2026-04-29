import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
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
        createdAt: Date;
        restaurantId: string;
        status: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
    }>;
    closeSession(id: string): Promise<{
        id: string;
        createdAt: Date;
        restaurantId: string;
        status: string;
        tableId: string;
        lastActivityAt: Date;
        closedAt: Date | null;
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    updateTable(id: string, tableId: string): Promise<{
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    cancelOrder(id: string): Promise<{
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    confirmDelivery(id: string): Promise<{
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markAsPaid(id: string): Promise<{
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
        tableId: string;
        sessionId: string | null;
        customerId: string | null;
    }>;
    markPaidBulk(restaurantId: string, orderIds: string[]): Promise<{
        success: boolean;
        count: number;
    }>;
}
