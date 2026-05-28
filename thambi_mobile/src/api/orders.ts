import api from './client';

export type OrderStatus =
    | 'Pending'
    | 'Confirmed'
    | 'Preparing'
    | 'Ready'
    | 'Assigned'
    | 'Delivered'
    | 'Cancelled';

export interface OrderItem {
    itemId: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface OrderTable {
    id: string;
    table_number: string;
    status?: string;
}

export interface OrderCustomer {
    name: string;
    phone: string;
}

export interface Order {
    id: string;
    tableId: string;
    sessionId?: string;
    table?: OrderTable | null;
    customerId?: string;
    customer?: OrderCustomer | null;
    status: OrderStatus;
    items: OrderItem[];
    notes?: string;
    total: number;
    payment?: {
        status: string;
        method: string;
    };
    createdAt: string;
    version: number;
}

export interface OrderSummary {
    pending: number;
    preparing: number;
    completed: number;
}

export const ordersApi = {
    create: (data: any) =>
        api.post<Order>('/orders', data).then(r => r.data),

    findAll: (restaurantId: string, status?: string) =>
        api.get<Order[]>('/orders', {
            params: { restaurantId, ...(status && status !== 'All' ? { status } : {}) },
        }).then(r => r.data),

    findById: (id: string) =>
        api.get<Order>(`/orders/${id}`).then(r => r.data),

    getSummary: (restaurantId: string) =>
        api.get<OrderSummary>('/orders/summary', { params: { restaurantId } }).then(r => r.data),

    updateStatus: (id: string, status: string, version?: number) =>
        api.patch<Order>(`/orders/${id}/status`, { status, version }).then(r => r.data),

    updateOrderItems: (id: string, items: { itemId: string, quantity: number }[], notes?: string, version?: number) =>
        api.patch<Order>(`/orders/${id}/items`, { items, notes, version }).then(r => r.data),

    mergeOrders: async (targetOrderId: string, sourceOrderIds: string[], version?: number): Promise<Order> => {
        const res = await api.post(`/orders/merge`, { targetOrderId, sourceOrderIds, version });
        return res.data;
    },

    markAsPaid: (id: string) =>
        api.patch<Order>(`/orders/${id}/pay`).then(r => r.data),

    getUnpaidSummary: (restaurantId: string, customerId?: string, sessionId?: string) =>
        api.get<{ count: number; total: number; orderIds: string[] }>('/orders/unpaid-summary', {
            params: { restaurantId, customerId, sessionId }
        }).then(r => r.data),

    markPaidBulk: (restaurantId: string, orderIds: string[]) =>
        api.patch<{ success: boolean; count: number }>('/orders/mark-paid-bulk', { orderIds }, {
            params: { restaurantId }
        }).then(r => r.data),

    getUnpaidGroups: (restaurantId: string) =>
        api.get<any[]>('/orders/unpaid-groups', { params: { restaurantId } }).then(r => r.data),

    closeSession: (sessionId: string) =>
        api.patch(`/orders/session/${sessionId}/close`).then(r => r.data),
};
