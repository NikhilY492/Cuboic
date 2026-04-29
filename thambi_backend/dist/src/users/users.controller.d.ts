import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        name: string;
        id: string;
        restaurantId: string | null;
        outletId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        is_active: boolean;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        image_url: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        name: string;
        id: string;
        restaurantId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        is_active: boolean;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        image_url: string | null;
        createdAt: Date;
    }[]>;
    update(id: string, dto: UpdateUserDto): Promise<{
        name: string;
        id: string;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        is_active: boolean;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    remove(id: string): Promise<{
        password_hash: string;
        name: string;
        id: string;
        restaurantId: string | null;
        outletId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        is_active: boolean;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        image_url: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
