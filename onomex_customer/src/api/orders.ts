import api from './client';

export interface OrderItem {
    itemId: string;
    quantity: number;
}

export interface PlaceOrderPayload {
    restaurantId: string;
    tableId: string;
    customerId?: string;
    customerSessionId: string;
    notes?: string;
    items: OrderItem[];
    paymentStatus?: 'Pending' | 'Paid';
}

// Matches the backend Order schema exactly
export interface Order {
    id: string;
    restaurantId: string;
    tableId: string | { id: string; table_number: number };
    table?: { id: string; table_number: number };
    /** Backend field name is `status` (not order_status) */
    status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Assigned' | 'Delivered' | 'Cancelled';
    notes?: string;
    items: Array<{
        name: string;
        quantity: number;
        unit_price?: number;
        unitPrice?: number;
    }>;
    customerId?: string;
    customer_session_id: string;
    subtotal: number;
    tax: number;
    total: number;
    createdAt: string;
}

export const placeOrder = (payload: PlaceOrderPayload) =>
    api.post<Order>('/orders', payload).then(r => r.data);

export const getOrder = (id: string) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data);

export const updateOrderTable = (id: string, tableId: string) =>
    api.patch<Order>(`/orders/${id}/table`, { tableId }).then(r => r.data);

export const cancelOrder = (id: string) =>
    api.patch<Order>(`/orders/${id}/cancel`).then(r => r.data);

export const getUnpaidSummary = (restaurantId: string, customerId?: string, sessionId?: string) =>
    api.get<{ count: number; total: number; orderIds: string[] }>('/orders/unpaid-summary', {
        params: { restaurantId, customerId, sessionId }
    }).then(r => r.data);

export const markPaidBulk = (restaurantId: string, orderIds: string[]) =>
    api.patch<{ success: boolean; count: number }>('/orders/mark-paid-bulk', {
        restaurantId,
        orderIds
    }).then(r => r.data);

export const checkSession = (restaurantId: string, tableId: string) =>
    api.get<{ id: string; status: string }>('/orders/check-session', {
        params: { restaurantId, tableId }
    }).then(r => r.data);
