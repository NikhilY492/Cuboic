import api from './client';

export interface Restaurant {
    id: string;
    name: string;
    paymentStrategy: 'PayPerOrder' | 'PayAtEnd';
    // add other fields if necessary
}

export const restaurantsApi = {
    findById: (id: string) => 
        api.get<Restaurant>(`/restaurants/${id}`).then(res => res.data),
    
    update: (id: string, data: Partial<Restaurant>) => 
        api.patch<Restaurant>(`/restaurants/${id}`, data).then(res => res.data)
};
