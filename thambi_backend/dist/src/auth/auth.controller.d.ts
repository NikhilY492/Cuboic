import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): {
        access_token: string;
        user: {
            id: any;
            name: any;
            userId: any;
            role: any;
            restaurantId: any;
            email: any;
            phone: any;
        };
    };
    me(req: any): any;
    changePassword(req: any, body: any): Promise<{
        id: string;
        name: string;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
    updateProfile(req: any, body: {
        email?: string;
        phone?: string;
    }): Promise<{
        id: string;
        name: string;
        restaurantId: string | null;
        user_id: string;
        role: import("@prisma/client").$Enums.UserRole;
        email: string | null;
        phone: string | null;
        dashboard_config: import("@prisma/client/runtime/library").JsonValue;
    }>;
}
