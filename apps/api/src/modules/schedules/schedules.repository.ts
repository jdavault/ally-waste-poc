import { Injectable } from '@nestjs/common';
import { PickupSchedule } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { pickupSchedules } from '../../seed/seed-data';

@Injectable()
export class SchedulesRepository extends InMemoryRepository<PickupSchedule> {
  constructor() {
    super(pickupSchedules);
  }

  findByPropertyId(propertyId: string): PickupSchedule[] {
    return this.entities.filter((s) => s.propertyId === propertyId);
  }
}
