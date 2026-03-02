import { IsString, IsOptional } from 'class-validator';

export class QueryMenuDto {
    @IsString()
    restaurant_id: string;

    @IsOptional()
    @IsString()
    table_id?: string;

    @IsOptional()
    @IsString()
    category_id?: string;
}
