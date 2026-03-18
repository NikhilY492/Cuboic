import { Controller, Post, Body } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) {}

    @Post('send-otp')
    sendOtp(@Body() body: { phone: string }) {
        return this.customersService.sendOtp(body.phone);
    }

    @Post('verify-otp')
    verifyOtp(@Body() body: { phone: string; otp: string }) {
        return this.customersService.verifyOtp(body.phone, body.otp);
    }
    
    @Post('register')
    register(@Body() body: { phone: string; name: string }) {
        return this.customersService.register(body.phone, body.name);
    }
}
