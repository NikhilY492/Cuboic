import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(dto: CreateOrderDto): Promise<{
        table: {
            id: string;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            orderId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
    getSummary(restaurantId: string): Promise<{
        pending: number;
        preparing: number;
        completed: number;
    }>;
    findOne(id: string): import("@prisma/client").Prisma.Prisma__OrderClient<({
        table: {
            id: string;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            orderId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(restaurantId: string, status?: string): import("@prisma/client").Prisma.PrismaPromise<({
        table: {
            id: string;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
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
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            orderId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    })[]>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
    updateTable(id: string, tableId: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
    cancelOrder(id: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
    confirmDelivery(id: string): Promise<{
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
    markAsPaid(id: string): Promise<{
        table: {
            id: string;
            restaurantId: string;
            table_number: string;
            is_active: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            amount: number;
            orderId: string;
            status: import("@prisma/client").$Enums.PaymentStatus;
            method: string;
            transaction_id: string | null;
        } | null;
    } & {
        id: string;
        restaurantId: string;
        createdAt: Date;
        updatedAt: Date;
        outletId: string | null;
        tableId: string;
        customerId: string | null;
        customer_session_id: string;
        orderType: string;
        items: import("@prisma/client/runtime/library").JsonValue;
        subtotal: number;
        tax: number;
        total: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        notes: string | null;
    }>;
}
