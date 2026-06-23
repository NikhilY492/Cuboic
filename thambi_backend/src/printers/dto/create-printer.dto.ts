import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsBoolean,
} from 'class-validator';
import { PrinterType, ConnectionType } from '@prisma/client';

export class CreatePrinterDto {
  @IsString()
  restaurantId: string;

  @IsString()
  name: string;

  @IsEnum(PrinterType)
  @IsOptional()
  type?: PrinterType;

  @IsEnum(ConnectionType)
  @IsOptional()
  connectionType?: ConnectionType;

  @IsString()
  @IsOptional()
  ipAddress?: string;

  @IsInt()
  @IsOptional()
  port?: number;

  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;
}
