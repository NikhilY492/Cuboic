import api from './client';

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Assigned' | 'Delivered';

export interface Order {
    _id: string;
    restaurant_id: string;
    table_id: { _id: string; table_number: number } | string;
    order_status: OrderStatus;
    payment_status: 'Pending' | 'Paid';
    items: Array<{ name: string; quantity: number; unit_price: number }>;
    subtotal: number;
    tax_amount: number;
    total_price: number;
    createdAt: string;
}

export const getOrders = (restaurantId: string, status?: string) =>
    api.get<Order[]>('/orders', {
        params: { restaurant_id: restaurantId, ...(status ? { status } : {}) },
    }).then(r => r.data);

export const getOrderById = (id: string) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data);

export const updateOrderStatus = (id: string, order_status: OrderStatus) =>
    api.patch<Order>(`/orders/${id}/status`, { order_status }).then(r => r.data);
