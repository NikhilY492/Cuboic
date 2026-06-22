import {
  IsString,
  IsIn,
  IsOptional,
  IsBoolean,
  MinLength,
  Matches,
  IsInt,
  IsDateString,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @Matches(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
  {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  },
)

  password?: string;

  @IsOptional()
  @IsIn([
    'Admin',
    'Owner',
    'Manager',
    'Captain',
    'Cashier',
    'Waiter',
    'Kitchen',
    'Staff',
  ])
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

  @IsOptional()
  @IsString()
  customRoleId?: string;
  
    @IsOptional()
  @IsInt()
  failedLoginAttempts?: number;

  @IsOptional()
  lockUntil?: Date | null;
 

}
