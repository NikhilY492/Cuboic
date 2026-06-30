import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('Owner', 'Admin', 'Staff')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.usersService.findAll(req.user.restaurantId);
  }

  @Get('roles')
  getRoles(@Req() req: any) {
    return this.usersService.getCustomRoles(req.user.restaurantId);
  }

  @Post('roles')
  createRole(
    @Req() req: any,
    @Body() body: { name: string; permissions: string[] },
  ) {
    return this.usersService.createCustomRole(
      req.user.restaurantId,
      body.name,
      body.permissions,
    );
  }

  @Patch('roles/:id')
updateRole(
  @Param('id') id: string,
  @Req() req: any,
  @Body() body: { name: string; permissions: string[] },
) {
  return this.usersService.updateCustomRole(
  id,
  req.user.restaurantId,
  body.name,
  body.permissions,
);
}

  @Delete('roles/:id')
deleteRole(@Param('id') id: string, @Req() req: any) {
  return this.usersService.deleteCustomRole(
  id,
  req.user.restaurantId,
);
}

  @Patch(':id') 
  update(
  @Param('id') id: string,
  @Req() req: any,
  @Body() dto: UpdateUserDto,
) {
  return this.usersService.update(
    id,
    req.user.restaurantId,
    dto,
  );
}

  @Delete(':id')
  remove(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.usersService.remove(
    id,
    req.user.restaurantId,
  );
}
}
