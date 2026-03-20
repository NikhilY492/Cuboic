import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): {
        access_token: string;
        user: {
            id: any;
            name: any;
            userId: any;
            role: any;
            restaurantId: any;
        };
    };
    me(req: any): any;
    changePassword(req: any, body: any): Promise<{
        name: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        user_id: string;
    }>;
}
