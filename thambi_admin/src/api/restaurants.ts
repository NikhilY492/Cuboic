import api from './client';

export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    paymentStrategy: 'PayPerOrder' | 'PayAtEnd';
}

export const restaurantsApi = {
    findById: (id: string) => api.get<Restaurant>(`/restaurants/${id}`),
    update: (id: string, data: Partial<Restaurant>) => api.patch<Restaurant>(`/restaurants/${id}`, data),
};
