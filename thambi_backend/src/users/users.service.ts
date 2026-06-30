import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    dto.userId = dto.userId.trim();
    dto.name = dto.name.trim();

    const existing = await this.prisma.user.findUnique({
      where: { user_id: dto.userId },
    });
    if (existing) throw new ConflictException('User ID already taken');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const { password_hash: _, ...user } = await this.prisma.user.create({
      data: {
        name: dto.name,
        user_id: dto.userId,
        password_hash: passwordHash,
        role: (dto.role as UserRole) ?? 'Staff',
        customRoleId: dto.customRoleId ?? null,
        restaurantId: dto.restaurantId ?? null,
        dashboard_config: dto.dashboard_config ?? [
          'Pending',
          'Preparing',
          'Completed',
          'Robots',
        ],
      },
    });
    return user;
  }

  findAll(restaurantId: string) {
    return this.prisma.user.findMany({
      where: { restaurantId },
      select: {
        id: true,
        name: true,
        user_id: true,
        role: true,
        customRoleId: true,
        customRole: true,
        is_active: true,
        restaurantId: true,
        createdAt: true,
        dashboard_config: true,
        email: true,
        phone: true,
        image_url: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.user.findUnique({
      where: { user_id: userId },
      include: {
        outlet: {
          select: {
            restaurantId: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { outlet: { select: { restaurantId: true } } },
    });
  }

  async updatePassword(id: string, hash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { password_hash: hash },
      select: {
        id: true,
        name: true,
        user_id: true,
        role: true,
        dashboard_config: true,
        email: true,
        phone: true,
        image_url: true,
      },
    });
  }

  async updateProfile(
    id: string,
    dto: { email?: string; phone?: string; image_url?: string },
  ) {
    return this.prisma.user.update({
      where: { id },
      data: { ...dto },
      select: {
        id: true,
        name: true,
        user_id: true,
        role: true,
        restaurantId: true,
        email: true,
        phone: true,
        dashboard_config: true,
        image_url: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    const data: any = { ...dto };
    if (dto.password) {
      data.password_hash = await bcrypt.hash(dto.password, 10);
    }
    delete data.password;

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        user_id: true,
        role: true,
        customRoleId: true,
        is_active: true,
        dashboard_config: true,
      },
    });
  }

  async remove(id: string, restaurantId: string) {
  const user = await this.prisma.user.findFirst({
    where: {
      id,
      restaurantId,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return this.prisma.user.delete({
    where: { id },
  });
}

    // --- Custom Roles ---

  async getCustomRoles(restaurantId: string) {
    return this.prisma.customRole.findMany({
      where: { restaurantId },
    });
  }

  async createCustomRole(
    restaurantId: string,
    name: string,
    permissions: string[],
  ) {
    return this.prisma.customRole.create({
      data: {
        restaurantId,
        name,
        permissions,
      },
    });
  }

  async updateCustomRole(
    id: string,
    restaurantId: string,
    name: string,
    permissions: string[],
  ) {
    const role = await this.prisma.customRole.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!role) {
      throw new ConflictException('Role not found');
    }

    return this.prisma.customRole.update({
      where: { id },
      data: {
        name,
        permissions,
      },
    });
  }

  async deleteCustomRole(id: string, restaurantId: string) {
    const role = await this.prisma.customRole.findFirst({
      where: {
        id,
        restaurantId,
      },
    });

    if (!role) {
      throw new ConflictException('Role not found');
    }

    return this.prisma.customRole.delete({
      where: { id },
    });
  }
}

