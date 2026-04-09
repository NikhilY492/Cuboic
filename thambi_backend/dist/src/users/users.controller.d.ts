import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        restaurantId: string | null;
        user_id: string;
        outletId: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        is_active: boolean;
        createdAt: Date;
        restaurantId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }[]>;
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
        user_id: string;
        outletId: string | null;
        password_hash: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
