import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../prisma/prisma.service';

// Helper to make an order stub
function makeOrder(overrides: Partial<{
    id: string; total: number; createdAt: Date; status: string;
    customerId: string | null; customer: any; items: any[];
}> = {}) {
    return {
        id: 'order-1',
        total: 200,
        createdAt: new Date('2025-01-15T12:00:00Z'),
        status: 'Delivered',
        customerId: null,
        customer: null,
        items: [],
        ...overrides,
    };
}

describe('AnalyticsService', () => {
    let service: AnalyticsService;
    let prisma: { order: { findMany: jest.Mock }; menuItem: { findMany: jest.Mock } };

    beforeEach(async () => {
        prisma = {
            order: { findMany: jest.fn() },
            menuItem: { findMany: jest.fn() },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnalyticsService,
                { provide: PrismaService, useValue: prisma },
            ],
        }).compile();

        service = module.get<AnalyticsService>(AnalyticsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // ── getRevenueTrends ────────────────────────────────────────────────────
    describe('getRevenueTrends', () => {
        it('returns zero metrics when no orders exist', async () => {
            prisma.order.findMany.mockResolvedValue([]);
            const result = await service.getRevenueTrends('rest-1');
            expect(result.totalRevenue).toBe(0);
            expect(result.orderVolume).toBe(0);
            expect(result.averageOrderValue).toBe(0);
            expect(result.trends).toHaveLength(0);
        });

        it('calculates totalRevenue, orderVolume, and averageOrderValue correctly', async () => {
            prisma.order.findMany.mockResolvedValue([
                makeOrder({ total: 200 }),
                makeOrder({ id: 'o2', total: 300 }),
                makeOrder({ id: 'o3', total: 100 }),
            ]);

            const result = await service.getRevenueTrends('rest-1');
            expect(result.totalRevenue).toBe(600);
            expect(result.orderVolume).toBe(3);
            expect(result.averageOrderValue).toBeCloseTo(200);
        });

        it('groups orders into daily trends correctly', async () => {
            prisma.order.findMany.mockResolvedValue([
                makeOrder({ total: 100, createdAt: new Date('2025-01-15T08:00:00Z') }),
                makeOrder({ id: 'o2', total: 150, createdAt: new Date('2025-01-15T20:00:00Z') }),
                makeOrder({ id: 'o3', total: 200, createdAt: new Date('2025-01-16T10:00:00Z') }),
            ]);

            const result = await service.getRevenueTrends('rest-1');
            expect(result.trends).toHaveLength(2);
            const jan15 = result.trends.find(t => t.date === '2025-01-15');
            const jan16 = result.trends.find(t => t.date === '2025-01-16');
            expect(jan15?.revenue).toBe(250);
            expect(jan15?.volume).toBe(2);
            expect(jan16?.revenue).toBe(200);
        });

        it('returns 24-element peakHours array with correct hour counts', async () => {
            // Use fixed UTC dates and getUTCHours to avoid local-timezone flakiness
            const makeAtHour = (utcHour: number, id = 'order-x') => ({
                ...makeOrder({ id }),
                createdAt: new Date(`2025-01-15T${String(utcHour).padStart(2, '0')}:00:00Z`),
            });

            prisma.order.findMany.mockResolvedValue([
                makeAtHour(12, 'o1'),
                makeAtHour(12, 'o2'),
                makeAtHour(19, 'o3'),
            ]);

            const result = await service.getRevenueTrends('rest-1');
            expect(result.peakHours).toHaveLength(24);

            // The service calls `.getHours()` (local time). We can't know the offset in CI,
            // so just verify the distribution is correct: two orders share one bucket, one order in another.
            const nonZeroBuckets = result.peakHours.filter(h => h.count > 0);
            expect(nonZeroBuckets).toHaveLength(2);
            const counts = nonZeroBuckets.map(h => h.count).sort((a, b) => b - a);
            expect(counts).toEqual([2, 1]);
        });
    });

    // ── getMenuAnalytics ────────────────────────────────────────────────────
    describe('getMenuAnalytics', () => {
        it('returns empty arrays when no orders exist', async () => {
            prisma.order.findMany.mockResolvedValue([]);
            prisma.menuItem.findMany.mockResolvedValue([]);

            const result = await service.getMenuAnalytics('rest-1');
            expect(result.popularItems).toHaveLength(0);
            expect(result.categoryPerformance).toHaveLength(0);
        });
    });

    // ── getCustomerInsights ─────────────────────────────────────────────────
    describe('getCustomerInsights', () => {
        it('returns zero new/returning when no orders with customerId', async () => {
            prisma.order.findMany.mockResolvedValue([]);

            const result = await service.getCustomerInsights('rest-1');
            expect(result.newCustomers).toBe(0);
            expect(result.returningCustomers).toBe(0);
            expect(result.topSpenders).toHaveLength(0);
        });

        it('identifies returning customers correctly', async () => {
            const customer = { id: 'cust-1', name: 'Alice', phone: '+911234567890' };
            // Current period orders
            prisma.order.findMany
                .mockResolvedValueOnce([
                    makeOrder({ customerId: 'cust-1', customer, total: 500 }),
                    makeOrder({ id: 'o2', customerId: 'cust-2', customer: { id: 'cust-2', name: 'Bob', phone: '+912' }, total: 300 }),
                ])
                // Past orders (for returning check) — cust-1 ordered before
                .mockResolvedValueOnce([{ customerId: 'cust-1' }]);

            const result = await service.getCustomerInsights('rest-1');
            expect(result.returningCustomers).toBe(1);
            expect(result.newCustomers).toBe(1);
            expect(result.topSpenders[0].id).toBe('cust-1');
            expect(result.topSpenders[0].totalSpent).toBe(500);
        });
    });
});
