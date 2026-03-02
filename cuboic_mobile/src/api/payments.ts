import api from './client';

export interface Payment {
    _id: string;
    order_id: string;
    restaurant_id: string;
    amount: number;
    method: string;
    status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
    createdAt: string;
}

export const getPayments = (restaurantId: string) =>
    api.get<Payment[]>('/payments', { params: { restaurant_id: restaurantId } }).then(r => r.data);
