import { IsString, IsNotEmpty, IsArray, ValidateNested, IsInt, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class DeliveryStopDto {
    @IsString()
    @IsNotEmpty()
    order_id: string;

    @IsString()
    @IsNotEmpty()
    table_id: string;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    cabinets: string[];

    @IsInt()
    @Min(1)
    sequence: number;
}

export class CreateDeliveryDto {
    @IsString()
    @IsNotEmpty()
    restaurant_id: string;

    @IsString()
    @IsNotEmpty()
    robot_id: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeliveryStopDto)
    @ArrayMinSize(1)
    stops: DeliveryStopDto[];
}
