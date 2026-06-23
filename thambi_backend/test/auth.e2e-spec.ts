import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthController (e2e)', () => {
    let app: INestApplication;
    let prisma: {
        user: { findUnique: jest.Mock };
    };

    beforeAll(async () => {
        prisma = {
            user: { findUnique: jest.fn() },
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

        it('should return 201 with access_token and user info on success', async () => {
            const hash = await bcrypt.hash('correct123', 10);
            prisma.user.findUnique.mockResolvedValue({
                id: 'uuid-1',
                user_id: 'john.doe',
                password_hash: hash,
                role: 'Manager',
                restaurantId: 'rest-1',
                outletId: null,
            });

            const res = await request(app.getHttpServer())
                .post('/auth/login')
                .send({ userId: 'john.doe', password: 'correct123' })
                .expect(201);

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
