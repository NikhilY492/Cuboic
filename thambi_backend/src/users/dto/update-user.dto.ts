import { IsString, IsIn, IsOptional, IsBoolean } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsIn(['Admin', 'Owner', 'Manager', 'Cashier', 'Waiter', 'Kitchen', 'Staff'])
    role?: string;

    @IsOptional()
    @IsString()
    restaurantId?: string;

    @IsOptional()
    dashboard_config?: any;

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsString()
    image_url?: string;
}
