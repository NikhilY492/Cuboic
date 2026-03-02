import api from './client';

export interface DeliveryStop {
    order_id: string;
    table_id: string;
    cabinets: string[];
    status: 'Pending' | 'Delivered';
    sequence: number;
    delivered_at?: string;
}

export interface Delivery {
    _id: string;
    restaurant_id: string;
    robot_id: string | { _id: string; display_name: string; robot_serial: string; status: string };
    trip_status: 'In-Transit' | 'Completed';
    stops: DeliveryStop[];
    completed_at?: string;
    createdAt: string;
}

export interface Robot {
    _id: string;
    display_name: string;
    robot_serial: string;
    status: 'Idle' | 'Delivering' | 'Charging' | 'Error';
    cabinets: Array<{ id: string; status: 'Available' | 'Occupied'; order_id?: string }>;
    restaurant_id: string;
}

export const getRobots = (restaurantId: string) =>
    api.get<Robot[]>('/robots', { params: { restaurant_id: restaurantId } }).then(r => r.data);

export const getActiveDeliveries = (restaurantId: string) =>
    api.get<Delivery[]>('/deliveries/active', { params: { restaurant_id: restaurantId } }).then(r => r.data);

export const confirmStop = (deliveryId: string, stopIndex: number) =>
    api.patch<Delivery>(`/deliveries/${deliveryId}/stops/${stopIndex}/confirm`).then(r => r.data);

export interface CreateDeliveryPayload {
    robot_id: string;
    stops: Array<{
        order_id: string;
        table_id: string;
        cabinets: string[];
        sequence: number;
    }>;
}

export const createDelivery = (payload: CreateDeliveryPayload) =>
    api.post<Delivery>('/deliveries', payload).then(r => r.data);
