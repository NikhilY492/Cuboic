import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    findAll(restaurantId: string) {
        return this.prisma.category.findMany({
            where: { restaurantId, is_active: true },
            orderBy: { display_order: 'asc' },
        });
    }

    async create({ restaurantId, name, display_order }: { restaurantId: string; name: string; display_order?: number }) {
        const count = await this.prisma.category.count({ where: { restaurantId } });
        return this.prisma.category.create({
            data: {
                restaurantId,
                name,
                display_order: display_order ?? count + 1,
                is_active: true,
            },
        });
    }
}
