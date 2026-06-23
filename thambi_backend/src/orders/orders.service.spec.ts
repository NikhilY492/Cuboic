import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventsGateway } from '../events/events.gateway';
import { PlatformFeesService } from '../platform-fees/platform-fees.service';
import { InventoryService } from '../inventory/inventory.service';
import { InventoryConsumptionService } from '../inventory/inventory-consumption.service';
import { AuditService } from '../audit/audit.service';
import { UsersService } from '../users/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

// ── Helpers ────────────────────────────────────────────────────────────────

function makePrisma() {
  return {
    order: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    menuItem: { findMany: jest.fn() },
    tableSession: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    payment: { update: jest.fn(), updateMany: jest.fn() },
    customer: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  };
}

const makeOrder = (overrides: any = {}) => ({
  id: 'order-1',
  restaurantId: 'rest-1',
  tableId: 'table-1',
  sessionId: null,
  customerId: null,
  customer_session_id: 'sess-abc',
  orderType: 'DineIn',
  items: [{ itemId: 'item-1', name: 'Biryani', unitPrice: 150, quantity: 2 }],
  subtotal: 300,
  tax: 0,
  total: 300,
  status: 'Pending',
  notes: null,
  version: 0,
  kotPrinted: false,
  kotPrintedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  payment: { id: 'pay-1', amount: 300, status: 'Pending' },
  table: { id: 'table-1', table_number: '5' },
  customer: null,
  session: null,
  outletId: null,
  ...overrides,
});

// ── Suite ─────────────────────────────────────────────────────────────────

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: ReturnType<typeof makePrisma>;
  let eventsGateway: jest.Mocked<Pick<EventsGateway, 'emitToRestaurant'>>;
  let usersService: jest.Mocked<Pick<UsersService, 'findById'>>;
  let platformFees: jest.Mocked<Pick<PlatformFeesService, 'createIfEligible'>>;
  let inventoryConsumption: jest.Mocked<
    Pick<InventoryConsumptionService, 'consumeOrderInventory'>
  >;
  let auditService: jest.Mocked<Pick<AuditService, 'logAction'>>;
  let eventEmitter: jest.Mocked<Pick<EventEmitter2, 'emit'>>;

  beforeEach(async () => {
    prisma = makePrisma();
    eventsGateway = { emitToRestaurant: jest.fn() };
    usersService = { findById: jest.fn() };
    platformFees = { createIfEligible: jest.fn().mockResolvedValue(undefined) };
    inventoryConsumption = {
      consumeOrderInventory: jest.fn().mockResolvedValue(undefined),
    };
    auditService = { logAction: jest.fn().mockResolvedValue(undefined) };
    eventEmitter = { emit: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: prisma },
        { provide: EventsGateway, useValue: eventsGateway },
        { provide: PlatformFeesService, useValue: platformFees },
        { provide: InventoryService, useValue: {} },
        {
          provide: InventoryConsumptionService,
          useValue: inventoryConsumption,
        },
        { provide: AuditService, useValue: auditService },
        { provide: UsersService, useValue: usersService },
        { provide: EventEmitter2, useValue: eventEmitter },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  // ── findOne ────────────────────────────────────────────────────────────
  describe('findOne', () => {
    it('returns an order when found', async () => {
      const order = makeOrder();
      prisma.order.findUnique.mockResolvedValue(order);
      const result = await service.findOne('order-1');
      expect(result).toEqual(order);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        include: { table: true, payment: true, customer: true },
      });
    });

    it('returns null when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      const result = await service.findOne('nonexistent');
      expect(result).toBeNull();
    });
  });

  // ── getSummary ─────────────────────────────────────────────────────────
  describe('getSummary', () => {
    it('correctly tallies Pending, Preparing, and Delivered counts', async () => {
      prisma.order.findMany.mockResolvedValue([
        { status: 'Pending' },
        { status: 'Pending' },
        { status: 'Confirmed' },
        { status: 'Preparing' },
        { status: 'Delivered' },
        { status: 'Cancelled' },
      ]);
      const summary = await service.getSummary('rest-1');
      expect(summary).toEqual({ pending: 2, preparing: 2, completed: 1 });
    });

    it('returns all zeros when no orders today', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      const summary = await service.getSummary('rest-1');
      expect(summary).toEqual({ pending: 0, preparing: 0, completed: 0 });
    });
  });

  // ── updateStatus ───────────────────────────────────────────────────────
  describe('updateStatus', () => {
    it('throws ConflictException on stale version', async () => {
      const existingOrder = makeOrder({ version: 5 });
      prisma.order.findUnique.mockResolvedValue(existingOrder);

      await expect(
        service.updateStatus('order-1', { status: 'Confirmed', version: 3 }),
      ).rejects.toThrow(ConflictException);
    });

    it('accepts a current version (equal) and updates status', async () => {
      const existingOrder = makeOrder({ version: 2, status: 'Pending' });
      const updatedOrder = makeOrder({ version: 3, status: 'Confirmed' });
      prisma.order.findUnique.mockResolvedValue(existingOrder);
      prisma.order.update.mockResolvedValue(updatedOrder);

      const result = await service.updateStatus('order-1', {
        status: 'Confirmed',
        version: 2,
      });
      expect(result.status).toBe('Confirmed');
      expect(eventsGateway.emitToRestaurant).toHaveBeenCalledWith(
        'rest-1',
        'order:updated',
        updatedOrder,
      );
    });

    it('emits order:print_kot when transitioning to Preparing', async () => {
      const existingOrder = makeOrder({ status: 'Confirmed', version: 1 });
      const updatedOrder = makeOrder({ status: 'Preparing', version: 2 });
      prisma.order.findUnique.mockResolvedValue(existingOrder);
      prisma.order.update.mockResolvedValue(updatedOrder);

      await service.updateStatus('order-1', {
        status: 'Preparing',
        version: 1,
      });

      expect(eventsGateway.emitToRestaurant).toHaveBeenCalledWith(
        'rest-1',
        'order:print_kot',
        updatedOrder,
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'order.preparing',
        updatedOrder,
      );
    });

    it('does NOT emit order:print_kot when already in Preparing', async () => {
      const existingOrder = makeOrder({ status: 'Preparing', version: 1 });
      const updatedOrder = makeOrder({ status: 'Ready', version: 2 });
      prisma.order.findUnique.mockResolvedValue(existingOrder);
      prisma.order.update.mockResolvedValue(updatedOrder);

      await service.updateStatus('order-1', { status: 'Ready', version: 1 });

      const kotCalls = (
        eventsGateway.emitToRestaurant as jest.Mock
      ).mock.calls.filter((c) => c[1] === 'order:print_kot');
      expect(kotCalls).toHaveLength(0);
    });
  });

  // ── cancelOrder ────────────────────────────────────────────────────────
  describe('cancelOrder', () => {
    it('customers can cancel a Pending order', async () => {
      const order = makeOrder({ status: 'Pending' });
      prisma.order.findUnique.mockResolvedValue(order);
      prisma.order.update.mockResolvedValue({ ...order, status: 'Cancelled' });

      const result = await service.cancelOrder('order-1');
      expect(result.status).toBe('Cancelled');
    });

    it('customers cannot cancel a non-Pending order', async () => {
      const order = makeOrder({ status: 'Preparing' });
      prisma.order.findUnique.mockResolvedValue(order);

      await expect(service.cancelOrder('order-1')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFoundException when order does not exist', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(service.cancelOrder('ghost-order')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('staff with Owner role can cancel a Preparing order', async () => {
      const order = makeOrder({ status: 'Preparing', version: 1 });
      prisma.order.findUnique.mockResolvedValue(order);
      usersService.findById.mockResolvedValue({
        role: 'Owner',
        dashboard_config: [],
      } as any);
      prisma.order.update.mockResolvedValue({ ...order, status: 'Cancelled' });

      const result = await service.cancelOrder('order-1', 'user-owner');
      expect(result.status).toBe('Cancelled');
      expect(auditService.logAction).toHaveBeenCalledWith(
        'rest-1',
        'user-owner',
        'Cancel Order',
        expect.any(Object),
      );
    });

    it('staff without permission cannot cancel', async () => {
      const order = makeOrder({ status: 'Preparing', version: 1 });
      prisma.order.findUnique.mockResolvedValue(order);
      usersService.findById.mockResolvedValue({
        role: 'Kitchen',
        dashboard_config: [],
      } as any);

      await expect(
        service.cancelOrder('order-1', 'user-kitchen'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── markItemsDelivered ─────────────────────────────────────────────────
  describe('markItemsDelivered', () => {
    it('sets status to Delivered when all items are delivered', async () => {
      const order = makeOrder({
        items: [
          { itemId: 'item-1', quantity: 1, isDelivered: false },
          { itemId: 'item-2', quantity: 1, isDelivered: false },
        ],
        status: 'Ready',
      });
      prisma.order.findUnique.mockResolvedValue(order);
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({
          ...order,
          ...data,
          status: data.status ?? order.status,
        }),
      );

      const result = await service.markItemsDelivered('order-1', [
        'item-1',
        'item-2',
      ]);
      expect(result.status).toBe('Delivered');
    });

    it('keeps current status when only some items are delivered', async () => {
      const order = makeOrder({
        items: [
          { itemId: 'item-1', quantity: 1, isDelivered: false },
          { itemId: 'item-2', quantity: 1, isDelivered: false },
        ],
        status: 'Ready',
      });
      prisma.order.findUnique.mockResolvedValue(order);
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ ...order, ...data }),
      );

      const result = await service.markItemsDelivered('order-1', ['item-1']);
      expect(result.status).toBe('Ready');
    });

    it('throws NotFoundException for unknown order', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      await expect(
        service.markItemsDelivered('ghost', ['item-1']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ── getOrCreateSession ─────────────────────────────────────────────────
  describe('getOrCreateSession', () => {
    it('returns existing active session and updates lastActivityAt', async () => {
      const existingSession = {
        id: 'sess-1',
        restaurantId: 'rest-1',
        tableId: 'table-1',
        status: 'Active',
        lastActivityAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
      };
      prisma.tableSession.findFirst.mockResolvedValue(existingSession);
      prisma.tableSession.update.mockResolvedValue({
        ...existingSession,
        lastActivityAt: new Date(),
      });

      const session = await service.getOrCreateSession('rest-1', 'table-1');
      expect(session.id).toBe('sess-1');
      expect(prisma.tableSession.create).not.toHaveBeenCalled();
    });

    it('expires old session and creates a new one after 90 min inactivity', async () => {
      const oldSession = {
        id: 'sess-old',
        status: 'Active',
        lastActivityAt: new Date(Date.now() - 100 * 60 * 1000), // 100 mins ago
      };
      const newSession = { id: 'sess-new', status: 'Active' };
      prisma.tableSession.findFirst.mockResolvedValue(oldSession);
      prisma.tableSession.update.mockResolvedValue({
        ...oldSession,
        status: 'Expired',
      });
      prisma.tableSession.create.mockResolvedValue(newSession);

      const session = await service.getOrCreateSession('rest-1', 'table-1');
      expect(prisma.tableSession.update).toHaveBeenCalledWith(
        expect.objectContaining({ data: { status: 'Expired' } }),
      );
      expect(session.id).toBe('sess-new');
    });

    it('creates a new session when none exists', async () => {
      prisma.tableSession.findFirst.mockResolvedValue(null);
      const newSession = { id: 'sess-new', status: 'Active' };
      prisma.tableSession.create.mockResolvedValue(newSession);

      const session = await service.getOrCreateSession('rest-1', 'table-1');
      expect(session.id).toBe('sess-new');
    });
  });

  // ── mergeOrders ────────────────────────────────────────────────────────
  describe('mergeOrders', () => {
    it('accumulates quantities for duplicate items', async () => {
      const targetOrder = makeOrder({
        items: [
          { itemId: 'item-1', name: 'Biryani', unitPrice: 150, quantity: 1 },
        ],
        version: 0,
      });
      const sourceOrder = makeOrder({
        id: 'order-2',
        items: [
          { itemId: 'item-1', name: 'Biryani', unitPrice: 150, quantity: 2 },
        ],
      });

      prisma.order.findUnique.mockResolvedValue(targetOrder);
      prisma.order.findMany.mockResolvedValue([sourceOrder]);
      prisma.order.update.mockImplementation(({ data }) =>
        Promise.resolve({ ...targetOrder, ...data }),
      );

      const result = await service.mergeOrders('order-1', ['order-2']);
      const mergedItems = result.items as any[];
      const biryani = mergedItems.find((i: any) => i.itemId === 'item-1');
      expect(biryani.quantity).toBe(3);
    });

    it('throws BadRequestException when no valid source orders found', async () => {
      const targetOrder = makeOrder({ version: 0 });
      prisma.order.findUnique.mockResolvedValue(targetOrder);
      prisma.order.findMany.mockResolvedValue([]);

      await expect(
        service.mergeOrders('order-1', ['ghost-order']),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ── getUnpaidSummary ───────────────────────────────────────────────────
  describe('getUnpaidSummary', () => {
    it('throws BadRequestException when no identifier provided', async () => {
      await expect(
        service.getUnpaidSummary('rest-1', undefined, undefined, undefined),
      ).rejects.toThrow(BadRequestException);
    });

    it('returns correct total and orderIds for session', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'o1', total: 200, payment: { status: 'Pending' } },
        { id: 'o2', total: 150, payment: { status: 'Pending' } },
      ]);

      const result = await service.getUnpaidSummary(
        'rest-1',
        undefined,
        'sess-abc',
      );
      expect(result.total).toBe(350);
      expect(result.orderIds).toEqual(['o1', 'o2']);
      expect(result.count).toBe(2);
    });

    it('resolves customer by phone and returns unpaid summary', async () => {
      prisma.customer.findUnique.mockResolvedValue({ id: 'cust-1' });
      prisma.order.findMany.mockResolvedValue([
        { id: 'o1', total: 500, payment: { status: 'Pending' } },
      ]);

      const result = await service.getUnpaidSummary(
        'rest-1',
        undefined,
        undefined,
        '+919999999999',
      );
      expect(result.total).toBe(500);
    });
  });
});
