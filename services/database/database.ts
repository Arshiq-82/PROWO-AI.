import {
  DatabaseAdapter,
  DatabaseQuery,
  DatabaseRecord,
  DatabaseValue,
} from "./types";

export class InMemoryDatabase implements DatabaseAdapter {
  private readonly collections = new Map<
    string,
    Map<string, DatabaseRecord>
  >();

  async insert(
    collection: string,
    record: DatabaseRecord
  ): Promise<DatabaseRecord> {
    const records = this.getCollection(collection);

    if (records.has(record.id)) {
      throw new Error(
        `Record "${record.id}" already exists in "${collection}".`
      );
    }

    records.set(record.id, { ...record });
    return { ...record };
  }

  async findById(
    collection: string,
    id: string
  ): Promise<DatabaseRecord | undefined> {
    const record = this.getCollection(collection).get(id);
    return record ? { ...record } : undefined;
  }

  async findMany(query: DatabaseQuery): Promise<DatabaseRecord[]> {
    const records = Array.from(this.getCollection(query.collection).values());

    const filtered = query.where
      ? records.filter((record) =>
          Object.entries(query.where ?? {}).every(
            ([key, value]) => record[key] === value
          )
        )
      : records;

    return filtered
      .slice(0, query.limit ?? filtered.length)
      .map((record) => ({ ...record }));
  }

  async update(
    collection: string,
    id: string,
    changes: Record<string, DatabaseValue>
  ): Promise<DatabaseRecord | undefined> {
    const records = this.getCollection(collection);
    const existing = records.get(id);

    if (!existing) {
      return undefined;
    }

    const updated: DatabaseRecord = {
      ...existing,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    records.set(id, updated);
    return { ...updated };
  }

  async delete(collection: string, id: string): Promise<boolean> {
    return this.getCollection(collection).delete(id);
  }

  private getCollection(
    collection: string
  ): Map<string, DatabaseRecord> {
    let records = this.collections.get(collection);

    if (!records) {
      records = new Map<string, DatabaseRecord>();
      this.collections.set(collection, records);
    }

    return records;
  }
}
