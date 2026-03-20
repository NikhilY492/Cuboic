import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class CustomersService implements OnModuleInit {

    constructor(private prisma: PrismaService) {}

    onModuleInit() {
        if (!admin.apps.length) {
            // Robust cleaning for private key from environment variables
            const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
            const cleanedKey = rawKey
                .replace(/"/g, '') // Remove literal quotes
                .replace(/\\n/g, '\n'); // Convert literal \n to real newlines

            const config = {
                project_id: process.env.FIREBASE_PROJECT_ID?.replace(/"/g, ''),
                client_email: process.env.FIREBASE_CLIENT_EMAIL?.replace(/"/g, ''),
                private_key: cleanedKey,
            };

            if (!config.project_id || !config.client_email || !config.private_key) {
                console.warn('[Firebase Admin] Warning: Missing one or more Firebase environment variables!');
            }

            try {
                admin.initializeApp({
                    credential: admin.credential.cert(config as any),
                });
                console.log('[Firebase Admin] Initialized successfully.');
            } catch (err: any) {
                console.error('[Firebase Admin] Initialization failed:', err.message);
                // Don't throw here to avoid crashing the whole backend during startup if possible,
                // but usually NestJS onModuleInit errors are fatal.
                throw err;
            }
        }
    }

    async verifyFirebaseToken(idToken: string) {
        let decodedToken: admin.auth.DecodedIdToken;
        try {
            decodedToken = await admin.auth().verifyIdToken(idToken);
        } catch (err: any) {
            throw new BadRequestException('Invalid or expired Firebase token.');
        }

        const phone = decodedToken.phone_number;
        if (!phone) {
            throw new BadRequestException('No phone number associated with this token.');
        }

        console.log(`[Firebase Admin] Token verified for ${phone}`);

        // Strip country code for storage (keep consistent with existing DB records)
        const localPhone = phone.replace(/^\+91/, '');

        const customer = await this.prisma.customer.findUnique({
            where: { phone: localPhone },
        });

        return {
            verified: true,
            customer: customer || null,
            phone: localPhone,
        };
    }

    async register(phone: string, name: string) {
        let customer = await this.prisma.customer.findUnique({ where: { phone } });
        if (!customer) {
            customer = await this.prisma.customer.create({
                data: { phone, name },
            });
        }
        return customer;
    }
}
