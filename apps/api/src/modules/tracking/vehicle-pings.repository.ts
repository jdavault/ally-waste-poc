import { Injectable } from '@nestjs/common';
import { VehiclePing } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { vehiclePings } from '../../seed/seed-data';

@Injectable()
export class VehiclePingsRepository extends InMemoryRepository<VehiclePing> {
  constructor() {
    super(vehiclePings);
  }

  findByRouteId(routeId: string): VehiclePing[] {
    return this.entities.filter((p) => p.routeId === routeId);
  }

  findLatestByWorkerId(workerId: string): VehiclePing | undefined {
    return this.entities
      .filter((p) => p.workerId === workerId)
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )[0];
  }
}
