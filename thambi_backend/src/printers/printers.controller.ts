import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PrintersService } from './printers.service';
import { CreatePrinterDto } from './dto/create-printer.dto';
import { UpdatePrinterDto } from './dto/update-printer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('printers')
export class PrintersController {
  constructor(private readonly printersService: PrintersService) {}

  @Post()
  create(@Body() createPrinterDto: CreatePrinterDto) {
    return this.printersService.create(createPrinterDto);
  }

  @Get()
  findAll(@Query('restaurantId') restaurantId: string) {
    return this.printersService.findAll(restaurantId);
  }

  @Get(':id')
findOne(@Param('id') id: string, @Req() req: any) {
  return this.printersService.findOne(
    id,
    req.user.restaurantId,
  );
}

  @Patch(':id')
update(
  @Param('id') id: string,
  @Req() req: any,
  @Body() updatePrinterDto: UpdatePrinterDto,
) {
  return this.printersService.update(
    id,
    req.user.restaurantId,
    updatePrinterDto,
  );
}

  @Delete(':id')
remove(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.printersService.remove(
    id,
    req.user.restaurantId,
  );
}

  @Post(':id/test')
testPrint(
  @Param('id') id: string,
  @Req() req: any,
) {
  return this.printersService.testPrint(
    id,
    req.user.restaurantId,
  );
}

  @Post('reprint/:orderId')
  reprintKot(@Param('orderId') orderId: string) {
    return this.printersService.reprintKot(orderId);
  }
}
