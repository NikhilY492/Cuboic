import {
  Controller,
  Post,
  Patch,
  Get,
  UseGuards,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req: any) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) return req.user; // fallback to JWT payload
    const restaurantId =
      user.restaurantId ?? (user as any).outlet?.restaurantId ?? null;
    return {
      id: user.id,
      name: user.name,
      userId: user.user_id,
      role: user.role,
      restaurantId,
      email: user.email ?? null,
      phone: user.phone ?? null,
      image_url: user.image_url ?? null,
      dashboard_config: (user as any).dashboard_config ?? [],
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  changePassword( @Request() req: any, @Body() body: ChangePasswordDto,) {
    return this.authService.changePassword(
      req.user.userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  updateProfile(
    @Request() req: any,
    @Body() body: { email?: string; phone?: string; image_url?: string },
  ) {
    return this.usersService.updateProfile(req.user.sub, body);
  }
}
