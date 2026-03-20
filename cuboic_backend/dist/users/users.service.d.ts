import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        restaurantId: string | null;
        name: string;
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
    }>;
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        restaurantId: string | null;
        name: string;
        id: string;
        is_active: boolean;
        createdAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
    }[]>;
    findByUserId(userId: string): Promise<{
        restaurantId: string | null;
        name: string;
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
        password_hash: string;
    } | null>;
    updatePassword(id: string, hash: string): Promise<{
        name: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        name: string;
        id: string;
        is_active: boolean;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
    }>;
    remove(id: string): Promise<{
        restaurantId: string | null;
        name: string;
        id: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
        password_hash: string;
    }>;
}
