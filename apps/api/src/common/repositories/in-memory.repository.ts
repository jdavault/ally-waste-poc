import { IRepository } from '../interfaces/repository.interface';

export abstract class InMemoryRepository<T extends { id: string }>
  implements IRepository<T>
{
  protected entities: T[] = [];

  constructor(initialData: T[] = []) {
    this.entities = [...initialData];
  }

  findAll(): T[] {
    return [...this.entities];
  }

  findById(id: string): T | undefined {
    return this.entities.find((e) => e.id === id);
  }

  create(entity: T): T {
    this.entities.push(entity);
    return entity;
  }

  update(id: string, partial: Partial<T>): T | undefined {
    const index = this.entities.findIndex((e) => e.id === id);
    if (index === -1) return undefined;

    this.entities[index] = { ...this.entities[index], ...partial };
    return this.entities[index];
  }

  delete(id: string): boolean {
    const index = this.entities.findIndex((e) => e.id === id);
    if (index === -1) return false;

    this.entities.splice(index, 1);
    return true;
  }
}
