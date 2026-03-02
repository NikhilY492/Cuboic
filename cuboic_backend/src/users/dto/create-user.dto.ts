import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsIn(['Admin', 'Owner', 'Staff'])
    role: string;

    @IsOptional()
    @IsString()
    restaurant_id?: string;
}
