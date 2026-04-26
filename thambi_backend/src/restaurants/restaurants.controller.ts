import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { EventsGateway } from '../events/events.gateway';
import { RestaurantsService } from './restaurants.service';
@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly eventsGateway: EventsGateway,
  ) { }

  // GET /restaurants
  @Get()
  async getAll() {
    return this.restaurantsService.findAll();
  }

  // GET /restaurants/:id/tables
  @Get(':id/tables')
  async getTables(@Param('id') id: string) {
    return this.restaurantsService.findTables(id);
  }

  // GET /restaurants/:id
  @Get(':id')
  async getById(@Param('id') id: string) {
    const restaurant = await this.restaurantsService.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  // POST /restaurants
  @Post()
  async create(@Body() body: any) {
    console.log("BODY:", body);
    return this.restaurantsService.create(body);
  }

  // PATCH /restaurants/:id
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.restaurantsService.update(id, body);
  }

  // POST /restaurants/:id/call-captain
  @Post(':id/call-captain')
  async callCaptain(@Param('id') id: string, @Body() body: { tableId?: string, tableName?: string }) {
    this.eventsGateway.emitToRestaurant(id, 'callCaptain', {
      tableId: body.tableId,
      tableName: body.tableName,
      timestamp: new Date().toISOString(),
      message: `Customer at ${body.tableName || 'a table'} needs the Captain!`
    });
    return { success: true };
  }
}