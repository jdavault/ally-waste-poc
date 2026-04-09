import { Injectable } from '@nestjs/common';
import { Property } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { properties } from '../../seed/seed-data';

@Injectable()
export class PropertiesRepository extends InMemoryRepository<Property> {
  constructor() {
    super(properties);
  }
}
