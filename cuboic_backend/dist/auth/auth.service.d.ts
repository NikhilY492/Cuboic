import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(userId: string, password: string): Promise<import("../users/schemas/user.schema").UserDocument | null>;
    login(user: any): {
        access_token: string;
        user: {
            id: any;
            name: any;
            user_id: any;
            role: any;
            restaurant_id: any;
        };
    };
}
