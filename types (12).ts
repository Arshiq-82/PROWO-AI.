export type DatabaseValue =
  | string
  | number
  | boolean
  | null
  | DatabaseValue[]
  | { [key: string]: DatabaseValue };

export interface DatabaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: DatabaseValue;
}

export interface DatabaseQuery {
  collection: string;
  where?: Record<string, DatabaseValue>;
  limit?: number;
}

export interface DatabaseAdapter {
  insert(collection: string, record: DatabaseRecord): Promise<DatabaseRecord>;
  findById(collection: string, id: string): Promise<DatabaseRecord | undefined>;
  findMany(query: DatabaseQuery): Promise<DatabaseRecord[]>;
  update(
    collection: string,
    id: string,
    changes: Record<string, DatabaseValue>
  ): Promise<DatabaseRecord | undefined>;
  delete(collection: string, id: string): Promise<boolean>;
}
