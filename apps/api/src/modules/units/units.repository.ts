import { Injectable } from '@nestjs/common';
import { Unit } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { units } from '../../seed/seed-data';

@Injectable()
export class UnitsRepository extends InMemoryRepository<Unit> {
  constructor() {
    super(units);
  }

  findByBuildingId(buildingId: string): Unit[] {
    return this.entities.filter((u) => u.buildingId === buildingId);
  }
}
