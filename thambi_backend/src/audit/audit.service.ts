import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
    private readonly logger = new Logger(AuditService.name);

    constructor(private prisma: PrismaService) {}

    async logAction(restaurantId: string, userId: string, action: string, details: any) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    restaurantId,
                    userId,
                    action,
                    details,
                },
            });
            this.logger.log(`[Audit] User ${userId} performed ${action} for restaurant ${restaurantId}`);
        } catch (error) {
            this.logger.error(`Failed to create audit log: ${error.message}`);
        }
    }

    async findAll(restaurantId: string) {
        return this.prisma.auditLog.findMany({
            where: { restaurantId },
            orderBy: { createdAt: 'desc' },
            take: 100, // Limit to recent 100 logs
        });
    }
}
