import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get('routes/:routeId/events')
  @ApiOperation({ summary: 'Get event timeline for a route' })
  findByRoute(@Param('routeId') routeId: string) {
    return this.eventsService.findByRouteId(routeId);
  }
}
