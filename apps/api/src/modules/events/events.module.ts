import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { RouteEventsGateway } from './events.gateway';

@Module({
  controllers: [EventsController],
  providers: [EventsService, EventsRepository, RouteEventsGateway],
  exports: [EventsService, EventsRepository, RouteEventsGateway],
})
export class EventsModule {}
