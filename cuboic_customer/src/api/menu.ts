import api from './client';

export interface Category {
    _id: string;
    name: string;
    display_order: number;
}

export interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    category_id: string;
    image_url?: string;
    is_available: boolean;
}

export interface Restaurant {
    _id: string;
    name: string;
    slug: string;
    settings?: { tax_percentage: number };
}

export const getRestaurant = (id: string) =>
    api.get<Restaurant>(`/restaurants/${id}`).then(r => r.data);

export const getCategories = (restaurantId: string) =>
    api.get<Category[]>('/categories', { params: { restaurant_id: restaurantId } }).then(r => r.data);

export const getMenuItems = (restaurantId: string, categoryId?: string) =>
    api
        .get<MenuItem[]>('/menu', {
            params: { restaurant_id: restaurantId, ...(categoryId ? { category_id: categoryId } : {}) },
        })
        .then(r => r.data);
