import { apiClient } from './client'

export const ordersApi = {
    findAll: (restaurantId: string, status?: string) =>
        apiClient.get('/orders', { params: { restaurantId, status } }),

    getSummary: (restaurantId: string) =>
        apiClient.get('/orders/summary', { params: { restaurantId } }),

    updateStatus: (id: string, status: string) =>
        apiClient.patch(`/orders/${id}/status`, { status }),

    markAsPaid: (id: string) =>
        apiClient.patch(`/orders/${id}/pay`),

    markPaidBulk: (restaurantId: string, orderIds: string[]) =>
        apiClient.patch('/orders/mark-paid-bulk', { orderIds }, {
            params: { restaurantId }
        }),
}
