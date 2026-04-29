import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        image_url: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        outletId: string | null;
    }>;
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        restaurantId: string | null;
        image_url: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
    findByUserId(userId: string): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        image_url: string | null;
        user_id: string;
        password_hash: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        outletId: string | null;
    } | null>;
    updatePassword(id: string, hash: string): Promise<{
        id: string;
        name: string;
        image_url: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateProfile(id: string, dto: {
        email?: string;
        phone?: string;
        image_url?: string;
    }): Promise<{
        id: string;
        name: string;
        restaurantId: string | null;
        image_url: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        image_url: string | null;
        user_id: string;
        password_hash: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        outletId: string | null;
    }>;
}
