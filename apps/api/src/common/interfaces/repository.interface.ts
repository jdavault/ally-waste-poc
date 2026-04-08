export interface IRepository<T> {
  findAll(): T[];
  findById(id: string): T | undefined;
  create(entity: T): T;
  update(id: string, partial: Partial<T>): T | undefined;
  delete(id: string): boolean;
}
