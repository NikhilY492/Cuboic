import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuditService } from '../audit/audit.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(userId: string, password: string) {
    const user = await this.usersService.findByUserId(userId);

    if (!user) return null;

    // Account locked?
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException('Account locked. Try again later.');
    }

    const valid = await bcrypt.compare(password, user.password_hash);

    // Wrong password
    if (!valid) {
      const attempts = user.failedLoginAttempts + 1;

      await this.usersService.update(user.id, {
        failedLoginAttempts: attempts,
        lockUntil: attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null,
      });

      return null;
    }

    // Successful login → reset counter
    await this.usersService.update(user.id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });

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
    const user = await this.usersService.findByUserId(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValid = await bcrypt.compare(oldPass, user.password_hash);

    if (!isValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    if (newPass.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;

    if (!passwordRegex.test(newPass)) {
      throw new BadRequestException(
        'Password must contain uppercase, lowercase, number and special character',
      );
    }

    const hashed = await bcrypt.hash(newPass, 10);

    await this.usersService.updatePassword(user.id, hashed);

    const restaurantId = user.restaurantId ?? user.outlet?.restaurantId ?? '';

    await this.auditService.logAction(
      restaurantId,
      user.id,
      'Password Changed',
      {},
    );
    return { message: 'Password updated successfully' };
  }
}
