import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsOptional,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  password: string;

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
  role: string;

  @IsOptional()
  @IsString()
  restaurantId?: string;

  @IsOptional()
  dashboard_config?: any;

  @IsOptional()
  @IsString()
  customRoleId?: string;
}
