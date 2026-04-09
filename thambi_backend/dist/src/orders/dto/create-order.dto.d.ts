declare class OrderItemDto {
    itemId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    restaurantId: string;
    outletId?: string;
    tableId: string;
    customerSessionId: string;
    customerId?: string;
    orderType?: string;
    notes?: string;
    paymentStatus?: string;
    items: OrderItemDto[];
}
export {};
