import { Injectable, Optional } from '@nestjs/common';
import { EventLog, EntityType, EventType } from '@ally-waste/shared-types';
import { EventsRepository } from './events.repository';
import { RouteEventsGateway } from './events.gateway';
import { v4 as uuid } from 'uuid';

@Injectable()
export class EventsService {
  constructor(
    private readonly eventsRepository: EventsRepository,
    @Optional() private readonly gateway: RouteEventsGateway,
  ) {}

  findByRouteId(routeId: string): EventLog[] {
    return this.eventsRepository.findByRouteId(routeId);
  }

  findByEntity(entityType: EntityType, entityId: string): EventLog[] {
    return this.eventsRepository.findByEntity(entityType, entityId);
  }

  logEvent(
    entityType: EntityType,
    entityId: string,
    eventType: EventType,
    payload: Record<string, unknown>,
  ): EventLog {
    const event: EventLog = {
      id: uuid(),
      entityType,
      entityId,
      eventType,
      payload,
      createdAt: new Date().toISOString(),
    };
    const saved = this.eventsRepository.create(event);
    this.gateway?.broadcast(saved);
    return saved;
  }
}
