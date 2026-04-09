import { Injectable } from '@nestjs/common';
import { Building } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { buildings } from '../../seed/seed-data';

@Injectable()
export class BuildingsRepository extends InMemoryRepository<Building> {
  constructor() {
    super(buildings);
  }

  findByPropertyId(propertyId: string): Building[] {
    return this.entities.filter((b) => b.propertyId === propertyId);
  }
}
