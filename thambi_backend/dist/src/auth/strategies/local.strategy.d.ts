import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(userId: string, password: string): Promise<{
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
export {};
