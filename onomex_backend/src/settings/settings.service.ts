import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getRestaurantSettings(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        settings: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    if (!restaurant.settings) {
      // Create default settings if they don't exist
      const newSettings = await this.prisma.restaurantSettings.create({
        data: { restaurantId },
      });
      return { ...restaurant, settings: newSettings };
    }

    return restaurant;
  }

  async updateRestaurantSettings(restaurantId: string, dto: UpdateSettingsDto) {
    const { basic, config } = dto;

    if (basic) {
      await this.prisma.restaurant.update({
        where: { id: restaurantId },
        data: {
          name: basic.name,
          gstNumber: basic.gstNumber,
          address: basic.address,
          contactNumber: basic.contactNumber,
          email: basic.email,
          currency: basic.currency,
          paymentStrategy: basic.paymentStrategy,
        },
      });
    }

    if (config) {
      await this.prisma.restaurantSettings.upsert({
        where: { restaurantId },
        create: {
          restaurantId,
          orderSettings: config.orderSettings || {},
          paymentSettings: config.paymentSettings || {},
          notificationSettings: config.notificationSettings || {},
          themeSettings: config.themeSettings || {},
          integrations: config.integrations || {},
        },
        update: {
          ...(config.orderSettings && { orderSettings: config.orderSettings }),
          ...(config.paymentSettings && {
            paymentSettings: config.paymentSettings,
          }),
          ...(config.notificationSettings && {
            notificationSettings: config.notificationSettings,
          }),
          ...(config.themeSettings && { themeSettings: config.themeSettings }),
          ...(config.integrations && { integrations: config.integrations }),
        },
      });
    }

    return this.getRestaurantSettings(restaurantId);
  }

  async getOutlets(restaurantId: string) {
    return this.prisma.outlet.findMany({
      where: { restaurantId },
    });
  }

  async updateOutlet(outletId: string, data: any) {
    return this.prisma.outlet.update({
      where: { id: outletId },
      data,
    });
  }
}
