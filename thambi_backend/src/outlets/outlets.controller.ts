import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OutletsService } from './outlets.service';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('outlets')
export class OutletsController {
  constructor(private readonly outletsService: OutletsService) {}

  @Post()
  create(@Body() dto: CreateOutletDto) {
    return this.outletsService.create(dto);
  }

  @Get()
  findAll(@Query('restaurantId') restaurantId: string) {
    return this.outletsService.findAll(restaurantId);
  }

  @Get(':id')
findOne(@Param('id') id: string, @Req() req: any) {
  return this.outletsService.findOne(id, req.user.restaurantId);
}

  @Patch(':id')
update(
  @Param('id') id: string,
  @Body() body: Partial<CreateOutletDto>,
  @Req() req: any,
) {
  return this.outletsService.update(
    id,
    body,
    req.user.restaurantId,
  );
}
}
