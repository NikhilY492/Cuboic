import api from './client';

export interface AuditLog {
    id: string;
    restaurantId: string;
    userId: string;
    action: string;
    details: any;
    createdAt: string;
}

export const auditApi = {
    findAll: (restaurantId: string) =>
        api.get<AuditLog[]>('/audit', { params: { restaurantId } }).then(r => r.data),
};
