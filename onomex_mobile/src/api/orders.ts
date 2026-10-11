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
    isDelivered?: boolean;
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

export function normalizeOrder(order: any): Order {
    if (!order) return order;
    let items = order.items;
    while (typeof items === 'string') {
        try {
            items = JSON.parse(items);
        } catch {
            items = [];
            break;
        }
    }
    if (!Array.isArray(items)) {
        items = [];
    }
    const normalizedItems: OrderItem[] = items.map((it: any) => ({
        itemId: it.itemId || it.item_id || '',
        name: it.name || 'Item',
        quantity: Number(it.quantity) || 1,
        unitPrice: Number(it.unitPrice ?? it.unit_price ?? 0),
        isDelivered: it.isDelivered ?? it.is_delivered ?? false,
    }));

    return {
        ...order,
        items: normalizedItems,
        total: Number(order.total) || 0,
    };
}

export const ordersApi = {
    create: (data: any) =>
        api.post<Order>('/orders', data).then(r => normalizeOrder(r.data)),

    findAll: (restaurantId: string, status?: string) =>
        api.get<Order[]>('/orders', {
            params: { restaurantId, ...(status && status !== 'All' ? { status } : {}) },
        }).then(r => (Array.isArray(r.data) ? r.data.map(normalizeOrder) : [])),

    findById: (id: string) =>
        api.get<Order>(`/orders/${id}`).then(r => normalizeOrder(r.data)),

    getSummary: (restaurantId: string) =>
        api.get<OrderSummary>('/orders/summary', { params: { restaurantId } }).then(r => r.data),

    updateStatus: (id: string, status: string, version?: number) =>
        api.patch<Order>(`/orders/${id}/status`, { status, version }).then(r => normalizeOrder(r.data)),

    updateOrderItems: (id: string, items: { itemId: string, quantity: number }[], notes?: string, version?: number) =>
        api.patch<Order>(`/orders/${id}/items`, { items, notes, version }).then(r => normalizeOrder(r.data)),

    deliverItems: (id: string, itemIds: string[]) =>
        api.patch<Order>(`/orders/${id}/deliver-items`, { itemIds }).then(r => normalizeOrder(r.data)),

    mergeOrders: async (targetOrderId: string, sourceOrderIds: string[], version?: number): Promise<Order> => {
        const res = await api.post(`/orders/merge`, { targetOrderId, sourceOrderIds, version });
        return normalizeOrder(res.data);
    },

    markAsPaid: (id: string) =>
        api.patch<Order>(`/orders/${id}/pay`).then(r => normalizeOrder(r.data)),

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
