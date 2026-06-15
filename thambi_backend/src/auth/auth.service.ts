import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string) {
    const user = await this.usersService.findByUserId(userId);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return null;
    return user;
  }

  login(user: any) {
    // Resolve restaurantId: staff may be linked via an outlet rather than directly
    const restaurantId = user.restaurantId ?? user.outlet?.restaurantId ?? null;
    const payload = {
      sub: user.id,
      userId: user.user_id,
      role: user.role,
      restaurantId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        userId: user.user_id,
        role: user.role,
        restaurantId,
        email: user.email ?? null,
        phone: user.phone ?? null,
        image_url: user.image_url ?? null,
        dashboard_config: user.dashboard_config ?? [],
      },
    };
  }

  async changePassword(userId: string, oldPass: string, newPass: string) {
  const user = await this.usersService.findById(userId);

  if (!user) {
    throw new UnauthorizedException('User not found');
  }

  // 🔴 STEP 1: verify old password
  const isValid = await bcrypt.compare(oldPass, user.password_hash);

  if (!isValid) {
    throw new UnauthorizedException('Old password is incorrect');
  }

  // 🔴 STEP 2: validate new password strength
  if (newPass.length < 8) {
    throw new BadRequestException('Password must be at least 8 characters');
  }

  if (!/[A-Z]/.test(newPass) || !/[0-9]/.test(newPass)) {
    throw new BadRequestException('Password must contain uppercase letter and number');
  }

  // 🔴 STEP 3: hash new password
  const hashed = await bcrypt.hash(newPass, 10);

  // 🔴 STEP 4: update password
  await this.usersService.updatePassword(userId, hashed);

  return { message: 'Password updated successfully' };
}
}
