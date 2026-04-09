import { Injectable, NotFoundException } from '@nestjs/common';
import { Worker } from '@ally-waste/shared-types';
import { WorkersRepository } from './workers.repository';

@Injectable()
export class WorkersService {
  constructor(private readonly workersRepository: WorkersRepository) {}

  findAll(): Worker[] {
    return this.workersRepository.findAll();
  }

  findById(id: string): Worker {
    const worker = this.workersRepository.findById(id);
    if (!worker) {
      throw new NotFoundException(`Worker ${id} not found`);
    }
    return worker;
  }
}
