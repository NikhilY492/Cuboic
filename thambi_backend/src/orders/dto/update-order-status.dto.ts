import { IsString, IsIn, IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn([
    'Confirmed',
    'Preparing',
    'Ready',
    'Assigned',
    'Delivered',
    'Cancelled',
  ])
  status: string;

  @IsNumber()
  @IsOptional()
  version?: number;
}
