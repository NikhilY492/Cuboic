import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;
  let prisma: {
    order: { findMany: jest.Mock; findUnique: jest.Mock; update: jest.Mock };
    restaurant: { findUnique: jest.Mock };
    tableSession: { findFirst: jest.Mock };
  };
  let jwtService: JwtService;
  let validToken: string;

  beforeAll(async () => {
    prisma = {
      order: { findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
      restaurant: { findUnique: jest.fn() },
      tableSession: { findFirst: jest.fn() },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
    validToken = jwtService.sign({
      sub: 'user-1',
      role: 'Manager',
      restaurantId: 'rest-1',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /orders', () => {
    it('returns 401 Unauthorized if no JWT is provided', () => {
      return request(app.getHttpServer())
        .get('/orders?restaurantId=rest-1')
        .expect(401);
    });

    it('returns 200 with orders array when authenticated', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: 'order-1', status: 'Pending', items: [] },
      ]);

      const res = await request(app.getHttpServer())
        .get('/orders?restaurantId=rest-1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(res.body).toHaveLength(1);
      expect(res.body[0].id).toBe('order-1');
    });
  });

  describe('PATCH /orders/:id/status', () => {
    it('returns 200 and updates status', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: 'order-1', version: 1 });
      prisma.order.update.mockResolvedValue({
        id: 'order-1',
        status: 'Confirmed',
        version: 2,
      });

      const res = await request(app.getHttpServer())
        .patch('/orders/order-1/status')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'Confirmed', version: 1 })
        .expect(200);

      expect(res.body.status).toBe('Confirmed');
    });
  });
});
