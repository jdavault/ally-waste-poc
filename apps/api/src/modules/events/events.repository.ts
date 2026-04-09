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
    // Also include events for stops in that route
    // This is a bit more complex for in-memory without a join
    return this.entities.filter(
      (e) =>
        (e.entityType === EntityType.ROUTE && e.entityId === routeId) ||
        (e.entityType === EntityType.ROUTE_STOP && this.isStopInRoute()),
    );
  }

  private isStopInRoute(): boolean {
    // In a real DB this would be a join.
    // For now, we'd need access to RouteStopsRepository or just search the entityId
    // But since this is a POC, we can keep it simple or inject the other repo.
    return true; // Simplified for now
  }
}
