import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(userId: string, password: string): Promise<{
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
    } | null>;
    login(user: any): {
        access_token: string;
        user: {
            id: any;
            name: any;
            userId: any;
            role: any;
            restaurantId: any;
            email: any;
            phone: any;
            image_url: any;
        };
    };
    changePassword(userId: string, oldPass: string, newPass: string): Promise<{
        name: string;
        id: string;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
        image_url: string | null;
    }>;
}
