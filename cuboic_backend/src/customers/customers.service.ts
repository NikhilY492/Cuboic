import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as https from 'https';
import * as dotenv from 'dotenv';

// Force load .env on every hot-reload
dotenv.config();

@Injectable()
export class CustomersService {
    private msg91AuthKey: string;

    // In-memory OTP store: phone -> { otp, expiresAt }
    private otps = new Map<string, { otp: string, expiresAt: number }>();

    constructor(private prisma: PrismaService) {
        this.msg91AuthKey = process.env.MSG91_AUTH_KEY?.replace(/"/g, '') || '';

        if (this.msg91AuthKey) {
            console.log('MSG91 initialized successfully on backend!');
        } else {
            console.log('[MSG91] Auth key not found — falling back to console OTP.');
        }
    }

    async sendOtp(phone: string) {
        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Store it in memory for 5 minutes
        this.otps.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

        if (this.msg91AuthKey) {
            // MSG91 needs the number in full format: 91XXXXXXXXXX
            let formattedPhone = phone.trim().replace(/\D/g, '');
            if (formattedPhone.length === 10) {
                formattedPhone = '91' + formattedPhone;
            }

            const payload = JSON.stringify({
                mobile: formattedPhone,
                authkey: this.msg91AuthKey,
                otp,
            });

            const options = {
                hostname: 'control.msg91.com',
                path: '/api/v5/otp',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/JSON',
                    'authkey': this.msg91AuthKey,
                    'Content-Length': Buffer.byteLength(payload),
                },
            };

            await new Promise<void>((resolve, reject) => {
                const req = https.request(options, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        const parsed = JSON.parse(data);
                        if (parsed.type === 'success') {
                            console.log(`[MSG91] OTP sent to ${phone}`);
                            resolve();
                        } else {
                            console.error('[MSG91] Error:', data);
                            reject(new Error(data));
                        }
                    });
                });
                req.on('error', (err) => {
                    console.error('[MSG91] Request error:', err.message);
                    reject(err);
                });
                req.write(payload);
                req.end();
            }).catch(err => {
                // Non-fatal: log and fall back to console so sign-in still works during debugging
                console.error('[MSG91] Failed to send SMS, OTP logged to console:', err?.message);
                console.log(`[DEVELOPMENT] OTP for ${phone} is ${otp}`);
            });
        } else {
            console.log(`[DEVELOPMENT] MSG91 not configured. OTP for ${phone} is ${otp}`);
        }

        return { success: true, message: 'OTP sent successfully' };
    }

    async verifyOtp(phone: string, otp: string) {
        const record = this.otps.get(phone);
        if (!record) {
            throw new BadRequestException('No OTP found or expired');
        }
        if (Date.now() > record.expiresAt) {
            this.otps.delete(phone);
            throw new BadRequestException('OTP expired');
        }
        if (record.otp !== otp) {
            throw new BadRequestException('Invalid OTP');
        }

        // Clear OTP
        this.otps.delete(phone);

        // Check if customer exists
        const customer = await this.prisma.customer.findUnique({
            where: { phone }
        });

        return {
            verified: true,
            customer: customer || null,
            phone: phone
        };
    }

    async register(phone: string, name: string) {
        let customer = await this.prisma.customer.findUnique({ where: { phone } });
        if (!customer) {
            customer = await this.prisma.customer.create({
                data: { phone, name }
            });
        }
        return customer;
    }
}

