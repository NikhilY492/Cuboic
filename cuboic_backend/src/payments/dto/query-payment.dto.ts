import { IsOptional, IsString } from 'class-validator';

export class QueryPaymentDto {
    @IsString()
    restaurant_id: string;

    @IsOptional()
    @IsString()
    from?: string;

    @IsOptional()
    @IsString()
    to?: string;
}
