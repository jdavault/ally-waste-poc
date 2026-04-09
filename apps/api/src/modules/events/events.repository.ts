import { Injectable } from '@nestjs/common';
import { EventLog, EntityType } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { eventLogs } from '../../seed/seed-data';

@Injectable()
export class EventsRepository extends InMemoryRepository<EventLog> {
  constructor() {
    super(eventLogs);
  }

  findByEntity(entityType: EntityType, entityId: string): EventLog[] {
    return this.entities.filter(
      (e) => e.entityType === entityType && e.entityId === entityId,
    );
  }

  findByRouteId(routeId: string): EventLog[] {
    return this.entities.filter(
      (e) =>
        (e.entityType === EntityType.ROUTE && e.entityId === routeId) ||
        (e.payload && e.payload.routeId === routeId),
    );
  }
}
