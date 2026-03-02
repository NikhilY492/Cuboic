import api from './client';

export interface OrderItem {
    item_id: string;
    quantity: number;
    special_instructions?: string;
}

export interface PlaceOrderPayload {
    restaurant_id: string;
    table_id: string;
    customer_session_id: string;
    items: OrderItem[];
}

export interface Order {
    _id: string;
    restaurant_id: string;
    table_id: string | { _id: string; table_number: number };
    order_status: 'Received' | 'Preparing' | 'Ready' | 'Assigned' | 'Delivered';
    payment_status: 'Pending' | 'Paid';
    items: Array<{
        name: string;
        quantity: number;
        unit_price: number;
        special_instructions?: string;
    }>;
    subtotal: number;
    tax_amount: number;
    total_price: number;
    createdAt: string;
}

export const placeOrder = (payload: PlaceOrderPayload) =>
    api.post<Order>('/orders', payload).then(r => r.data);

export const getOrder = (id: string) =>
    api.get<Order>(`/orders/${id}`).then(r => r.data);
