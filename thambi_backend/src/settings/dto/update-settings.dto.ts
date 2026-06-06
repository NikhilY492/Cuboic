import { IsOptional, IsObject } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsObject()
  basic?: Record<string, any>;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
