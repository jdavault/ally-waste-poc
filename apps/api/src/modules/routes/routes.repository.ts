import { Injectable } from '@nestjs/common';
import { Route } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { routes } from '../../seed/seed-data';

@Injectable()
export class RoutesRepository extends InMemoryRepository<Route> {
  constructor() {
    // Stamp seed routes with today's UTC date at startup so the serviceDate
    // always matches findTodayByWorkerId regardless of when the image was built.
    const today = new Date().toISOString().split('T')[0];
    super(routes.map(r => ({ ...r, serviceDate: today })));
  }

  findByWorkerId(workerId: string): Route[] {
    return this.entities.filter((r) => r.workerId === workerId);
  }

  findTodayByWorkerId(workerId: string): Route | undefined {
    const today = new Date().toISOString().split('T')[0];
    return this.entities.find(
      (r) => r.workerId === workerId && r.serviceDate === today,
    );
  }
}
