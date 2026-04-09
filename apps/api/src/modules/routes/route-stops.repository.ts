import { Injectable } from '@nestjs/common';
import { RouteStop } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { routeStops } from '../../seed/seed-data';

@Injectable()
export class RouteStopsRepository extends InMemoryRepository<RouteStop> {
  constructor() {
    super(routeStops);
  }

  findByRouteId(routeId: string): RouteStop[] {
    return this.entities
      .filter((s) => s.routeId === routeId)
      .sort((a, b) => a.sequence - b.sequence);
  }
}
