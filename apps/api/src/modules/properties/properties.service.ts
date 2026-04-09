import { Injectable, NotFoundException } from '@nestjs/common';
import { Property } from '@ally-waste/shared-types';
import { PropertiesRepository } from './properties.repository';

@Injectable()
export class PropertiesService {
  constructor(private readonly propertiesRepository: PropertiesRepository) {}

  findAll(): Property[] {
    return this.propertiesRepository.findAll();
  }

  findById(id: string): Property {
    const property = this.propertiesRepository.findById(id);
    if (!property) {
      throw new NotFoundException(`Property ${id} not found`);
    }
    return property;
  }
}
