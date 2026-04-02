import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(dto: CreateUserDto): Promise<{
        id: string;
        restaurantId: string | null;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    findAll(restaurantId: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        restaurantId: string | null;
        is_active: boolean;
        createdAt: Date;
        name: string;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }[]>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        is_active: boolean;
        name: string;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    remove(id: string): Promise<{
        id: string;
        restaurantId: string | null;
        is_active: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        outletId: string | null;
        user_id: string;
        password_hash: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
}
