import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from '../prisma/prisma.service';

const makeRestaurant = (overrides: any = {}) => ({
  id: 'rest-1',
  name: 'Test Restaurant',
  description: null,
  logo_url: null,
  is_active: true,
  paymentStrategy: 'PayPerOrder',
  gstNumber: null,
  address: '123 Main St',
  contactNumber: null,
  email: null,
  currency: 'INR',
  latitude: 9.9312,
  longitude: 76.2673,
  geofenceEnabled: false,
  geofenceRadius: 25,
  createdAt: new Date(),
  updatedAt: new Date(),
  tables: [],
  ...overrides,
});

const makeTable = (overrides: any = {}) => ({
  id: 'table-1',
  restaurantId: 'rest-1',
  table_number: '1',
  is_active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: {
    restaurant: {
      findUnique: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    order: { findMany: jest.Mock };
    table: { findMany: jest.Mock; create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      restaurant: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      order: { findMany: jest.fn() },
      table: { findMany: jest.fn(), create: jest.fn() },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  // ── findById ────────────────────────────────────────────────────────────
  describe('findById', () => {
    it('returns null when restaurant does not exist', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(null);
      const result = await service.findById('nonexistent');
      expect(result).toBeNull();
    });

    it('returns restaurant with is_occupied=false when no active orders', async () => {
      const table = makeTable({ id: 'table-1' });
      prisma.restaurant.findUnique.mockResolvedValue(
        makeRestaurant({ tables: [table] }),
      );
      prisma.order.findMany.mockResolvedValue([]);

      const result = await service.findById('rest-1');
      expect(result!.tables[0].is_occupied).toBe(false);
    });

    it('marks tables as occupied when active orders exist for them', async () => {
      const table1 = makeTable({ id: 'table-1' });
      const table2 = makeTable({ id: 'table-2', table_number: '2' });
      prisma.restaurant.findUnique.mockResolvedValue(
        makeRestaurant({ tables: [table1, table2] }),
      );
      prisma.order.findMany.mockResolvedValue([{ tableId: 'table-1' }]);

      const result = await service.findById('rest-1');
      const t1 = result!.tables.find((t) => t.id === 'table-1');
      const t2 = result!.tables.find((t) => t.id === 'table-2');
      expect(t1!.is_occupied).toBe(true);
      expect(t2!.is_occupied).toBe(false);
    });

    it('includes geofence fields in the response', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(
        makeRestaurant({
          geofenceEnabled: true,
          geofenceRadius: 30,
          latitude: 10.0,
          longitude: 76.0,
        }),
      );
      prisma.order.findMany.mockResolvedValue([]);

      const result = await service.findById('rest-1');
      expect(result!.geofenceEnabled).toBe(true);
      expect(result!.geofenceRadius).toBe(30);
      expect(result!.latitude).toBe(10.0);
      expect(result!.longitude).toBe(76.0);
    });

    it('queried active order statuses are the correct 5 states', async () => {
      prisma.restaurant.findUnique.mockResolvedValue(
        makeRestaurant({ tables: [] }),
      );
      prisma.order.findMany.mockResolvedValue([]);

      await service.findById('rest-1');

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: {
              in: ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Assigned'],
            },
          }),
        }),
      );
    });
  });

  // ── findTables ──────────────────────────────────────────────────────────
  describe('findTables', () => {
    it('returns existing tables including an existing Takeaway table', async () => {
      const takeaway = makeTable({ table_number: 'Takeaway' });
      const table1 = makeTable({ id: 'table-2', table_number: '1' });
      prisma.table.findMany.mockResolvedValue([takeaway, table1]);

      const result = await service.findTables('rest-1');
      expect(result).toHaveLength(2);
      expect(prisma.table.create).not.toHaveBeenCalled();
    });

    it('auto-creates a Takeaway table when none exists', async () => {
      const table1 = makeTable({ table_number: '1' });
      const newTakeaway = makeTable({
        id: 'takeaway-id',
        table_number: 'Takeaway',
      });
      prisma.table.findMany.mockResolvedValue([table1]);
      prisma.table.create.mockResolvedValue(newTakeaway);

      const result = await service.findTables('rest-1');
      expect(prisma.table.create).toHaveBeenCalledWith({
        data: {
          restaurantId: 'rest-1',
          table_number: 'Takeaway',
          is_active: true,
        },
      });
      expect(result.some((t) => t.table_number === 'Takeaway')).toBe(true);
    });

    it('takeaway detection is case-insensitive', async () => {
      // "TAKEAWAY" should still count
      const table = makeTable({ table_number: 'TAKEAWAY' });
      prisma.table.findMany.mockResolvedValue([table]);

      await service.findTables('rest-1');
      expect(prisma.table.create).not.toHaveBeenCalled();
    });
  });

  // ── findAll ─────────────────────────────────────────────────────────────
  describe('findAll', () => {
    it('returns all restaurants', async () => {
      const restaurants = [
        makeRestaurant(),
        makeRestaurant({ id: 'rest-2', name: 'Second' }),
      ];
      prisma.restaurant.findMany.mockResolvedValue(restaurants);

      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });

  // ── update ──────────────────────────────────────────────────────────────
  describe('update', () => {
    it('passes geofence config correctly to prisma.update', async () => {
      const updatedRestaurant = makeRestaurant({
        geofenceEnabled: true,
        geofenceRadius: 15,
      });
      prisma.restaurant.update.mockResolvedValue(updatedRestaurant);

      const patch = {
        geofenceEnabled: true,
        geofenceRadius: 15,
        latitude: 9.9,
        longitude: 76.3,
      };
      await service.update('rest-1', patch);

      expect(prisma.restaurant.update).toHaveBeenCalledWith({
        where: { id: 'rest-1' },
        data: patch,
      });
    });
  });
});
