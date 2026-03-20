import { CustomersService } from './customers.service';
export declare class CustomersController {
    private readonly customersService;
    constructor(customersService: CustomersService);
    verifyFirebaseToken(body: {
        idToken: string;
    }): Promise<{
        verified: boolean;
        customer: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string;
        } | null;
        phone: string;
    }>;
    register(body: {
        phone: string;
        name: string;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
    }>;
}
