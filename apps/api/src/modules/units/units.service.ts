import { Injectable, NotFoundException } from '@nestjs/common';
import { Unit } from '@ally-waste/shared-types';
import { UnitsRepository } from './units.repository';

@Injectable()
export class UnitsService {
  constructor(private readonly unitsRepository: UnitsRepository) {}

  findByBuildingId(buildingId: string): Unit[] {
    return this.unitsRepository.findByBuildingId(buildingId);
  }

  findById(id: string): Unit {
    const unit = this.unitsRepository.findById(id);
    if (!unit) {
      throw new NotFoundException(`Unit ${id} not found`);
    }
    return unit;
  }
}
