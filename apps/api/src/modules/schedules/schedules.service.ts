import { Injectable } from '@nestjs/common';
import { PickupSchedule } from '@ally-waste/shared-types';
import { SchedulesRepository } from './schedules.repository';

@Injectable()
export class SchedulesService {
  constructor(private readonly schedulesRepository: SchedulesRepository) {}

  findByPropertyId(propertyId: string): PickupSchedule[] {
    return this.schedulesRepository.findByPropertyId(propertyId);
  }
}
