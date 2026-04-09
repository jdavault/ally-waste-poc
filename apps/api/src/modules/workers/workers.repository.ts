import { Injectable } from '@nestjs/common';
import { Worker } from '@ally-waste/shared-types';
import { InMemoryRepository } from '../../common/repositories/in-memory.repository';
import { workers } from '../../seed/seed-data';

@Injectable()
export class WorkersRepository extends InMemoryRepository<Worker> {
  constructor() {
    super(workers);
  }
}
