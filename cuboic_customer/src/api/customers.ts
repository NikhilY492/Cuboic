import api from './client';

export interface Customer {
    id: string;
    phone: string;
    name: string;
}

export const customersApi = {
    sendOtp: (phone: string) => api.post<{ success: boolean }>('/customers/send-otp', { phone }).then(r => r.data),
    verifyOtp: (phone: string, otp: string) => api.post<{ verified: boolean, customer: Customer | null }>('/customers/verify-otp', { phone, otp }).then(r => r.data),
    register: (phone: string, name: string) => api.post<Customer>('/customers/register', { phone, name }).then(r => r.data),
};
