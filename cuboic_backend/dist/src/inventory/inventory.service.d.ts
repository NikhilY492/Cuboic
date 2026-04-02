import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { StockInDto, StockAdjustDto } from './dto/stock-operations.dto';
export declare class InventoryService {
    private prisma;
    private eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    create(dto: CreateInventoryItemDto): import("@prisma/client").Prisma.Prisma__InventoryItemClient<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(outletId: string): import("@prisma/client").Prisma.PrismaPromise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }[]>;
    findLowStock(outletId: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }[]>;
    findOne(id: string): Promise<{
        transactions: {
            id: string;
            createdAt: Date;
            outletId: string;
            notes: string | null;
            costPerUnit: number | null;
            inventoryItemId: string;
            type: import("@prisma/client").$Enums.StockTransactionType;
            quantity: number;
            referenceId: string | null;
        }[];
    } & {
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }>;
    update(id: string, data: Partial<CreateInventoryItemDto>): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }>;
    remove(id: string): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }>;
    stockIn(id: string, dto: StockInDto): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }>;
    adjust(id: string, dto: StockAdjustDto): Promise<{
        category: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string;
        unit: string;
        currentStock: number;
        reservedStock: number;
        costPerUnit: number;
        reorderLevel: number;
    }>;
    deductForOrder(outletId: string, orderId: string, items: Array<{
        itemId: string;
        quantity: number;
    }>): Promise<void>;
    checkAvailability(outletId: string, items: Array<{
        itemId: string;
        quantity: number;
    }>): Promise<{
        available: boolean;
        unavailable: string[];
    }>;
}
