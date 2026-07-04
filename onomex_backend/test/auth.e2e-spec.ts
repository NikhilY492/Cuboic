import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: {
    user: { findUnique: jest.Mock; update: jest.Mock };
  };

  beforeAll(async () => {
    prisma = {
      user: { findUnique: jest.fn(), update: jest.fn() },
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/login', () => {
    it('should return 401 Unauthorized for invalid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ userId: 'wrong', password: 'password' })
        .expect(401);
    });

    it('should increment failedLoginAttempts for wrong password and lock account after 5 attempts', async () => {
      const hash = await bcrypt.hash('correct123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        user_id: 'john.doe',
        password_hash: hash,
        failedLoginAttempts: 4, // 5th attempt locks it
        lockUntil: null,
      });

      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ userId: 'john.doe', password: 'wrongpassword' })
        .expect(401);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: expect.objectContaining({
            failedLoginAttempts: 5,
            lockUntil: expect.any(Date),
          }),
        }),
      );
    });

    it('should return 401 if account is currently locked', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-2',
        user_id: 'locked.user',
        lockUntil: new Date(Date.now() + 100000), // Locked in the future
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ userId: 'locked.user', password: 'password' })
        .expect(401);

      expect(res.body.message).toBe('Account locked. Try again later.');
    });

    it('should return 201 with access_token and user info on success and reset failed attempts', async () => {
      const hash = await bcrypt.hash('correct123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        user_id: 'john.doe',
        password_hash: hash,
        role: 'Manager',
        restaurantId: 'rest-1',
        outletId: null,
        failedLoginAttempts: 2,
        lockUntil: null,
      });

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ userId: 'john.doe', password: 'correct123' })
        .expect(201);

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: expect.objectContaining({
            failedLoginAttempts: 0,
            lockUntil: null,
          }),
        }),
      );

      expect(res.body.access_token).toBeDefined();
      expect(res.body.user).toMatchObject({
        id: 'uuid-1',
        userId: 'john.doe',
        role: 'Manager',
        restaurantId: 'rest-1',
      });
    });
  });
});
