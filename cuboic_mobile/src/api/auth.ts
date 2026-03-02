import api from './client';

export interface LoginPayload { userId: string; password: string; }

export interface AuthUser {
    id: string;
    name: string;
    role: 'Owner' | 'Staff' | 'Admin';
    restaurant_id: string;
}

export interface LoginResponse {
    access_token: string;
    user: AuthUser;
}

export const login = (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then(r => r.data);
