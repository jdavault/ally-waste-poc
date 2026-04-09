import { Injectable, NotFoundException } from '@nestjs/common';
import { Building } from '@ally-waste/shared-types';
import { BuildingsRepository } from './buildings.repository';

@Injectable()
export class BuildingsService {
  constructor(private readonly buildingsRepository: BuildingsRepository) {}

  findByPropertyId(propertyId: string): Building[] {
    return this.buildingsRepository.findByPropertyId(propertyId);
  }

  findById(id: string): Building {
    const building = this.buildingsRepository.findById(id);
    if (!building) {
      throw new NotFoundException(`Building ${id} not found`);
    }
    return building;
  }
}
