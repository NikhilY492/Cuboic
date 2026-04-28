import api from './client';

export interface MenuItem {
    id: string;
    restaurantId: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_available: boolean;
    display_order: number;
}

export interface Category {
    id: string;
    name: string;
    display_order: number;
}

export interface CreateMenuItemPayload {
    restaurantId: string;
    categoryId: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_available?: boolean;
    display_order?: number;
}

export interface UpdateMenuItemPayload {
    categoryId?: string;
    name?: string;
    description?: string;
    price?: number;
    image_url?: string;
    is_available?: boolean;
    display_order?: number;
}

export const menuApi = {
    /** Fetch ALL items (including unavailable) — admin only */
    getAll: (restaurantId: string) =>
        api.get<MenuItem[]>('/menu/admin', { params: { restaurantId } }).then(r => r.data),

    /** Fetch categories for this restaurant */
    getCategories: (restaurantId: string) =>
        api.get<Category[]>('/categories', { params: { restaurantId } }).then(r => r.data),

    /** Create a new menu item */
    createItem: (payload: CreateMenuItemPayload) =>
        api.post<MenuItem>('/menu', payload).then(r => r.data),

    /** Update an existing menu item */
    updateItem: (id: string, payload: UpdateMenuItemPayload) =>
        api.put<MenuItem>(`/menu/${id}`, payload).then(r => r.data),

    /**
     * Upload an image file and return its public URL.
     * @param uri - local file URI from expo-image-picker
     * @param mimeType - e.g. 'image/jpeg'
     */
    uploadImage: async (uri: string, mimeType: string = 'image/jpeg'): Promise<string> => {
        const filename = uri.split('/').pop() ?? `upload_${Date.now()}.jpg`;
        const form = new FormData();
        form.append('file', { uri, name: filename, type: mimeType } as any);
        const res = await api.post<{ url: string }>('/upload/image', form, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.url;
    },
};

