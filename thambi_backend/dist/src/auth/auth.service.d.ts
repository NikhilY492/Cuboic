import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(userId: string, password: string): Promise<{
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
        id: string;
        name: string;
        image_url: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
