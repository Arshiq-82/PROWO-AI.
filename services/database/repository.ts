import {
  DatabaseAdapter,
  DatabaseRecord,
  DatabaseValue,
} from "./types";

export abstract class Repository<T extends DatabaseRecord> {
  constructor(
    protected readonly database: DatabaseAdapter,
    protected readonly collection: string
  ) {}

  async create(
    record: Omit<T, "createdAt" | "updatedAt">
  ): Promise<T> {
    const now = new Date().toISOString();

    const stored = await this.database.insert(this.collection, {
      ...record,
      createdAt: now,
      updatedAt: now,
    } as T);

    return stored as T;
  }

  async findById(id: string): Promise<T | undefined> {
    return (await this.database.findById(
      this.collection,
      id
    )) as T | undefined;
  }

  async findMany(
    where?: Record<string, DatabaseValue>,
    limit?: number
  ): Promise<T[]> {
    return (await this.database.findMany({
      collection: this.collection,
      where,
      limit,
    })) as T[];
  }

  async update(
    id: string,
    changes: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
  ): Promise<T | undefined> {
    return (await this.database.update(
      this.collection,
      id,
      changes as Record<string, DatabaseValue>
    )) as T | undefined;
  }

  async delete(id: string): Promise<boolean> {
    return this.database.delete(this.collection, id);
  }
}
