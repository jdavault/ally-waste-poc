import { Injectable } from '@nestjs/common';
import { Route, RouteStatus } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { routes } from '../../seed/seed-data';

@Injectable()
export class RoutesRepository extends InMemoryRepository<Route> {
  constructor() {
    super(routes);
  }

  findByWorkerId(workerId: string): Route[] {
    return this.entities.filter((r) => r.workerId === workerId);
  }

  findTodayByWorkerId(workerId: string): Route | undefined {
    // For in-memory demo: return the worker's most recent non-cancelled route.
    // Date-based filtering is brittle across UTC midnight and container restarts.
    // A real Postgres implementation would filter by serviceDate properly.
    return this.entities
      .filter(r => r.workerId === workerId && r.status !== RouteStatus.CANCELLED)
      .sort((a, b) => b.serviceDate.localeCompare(a.serviceDate))[0];
  }
}
