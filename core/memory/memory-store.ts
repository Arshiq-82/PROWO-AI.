import {
  MemoryQuery,
  MemoryRecord,
} from "./types";

export class MemoryStore {
  private readonly memories = new Map<string, MemoryRecord>();

  save(input: Omit<MemoryRecord, "createdAt" | "updatedAt">): MemoryRecord {
    const now = new Date().toISOString();

    const memory: MemoryRecord = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };

    this.memories.set(memory.id, memory);
    return memory;
  }

  update(
    id: string,
    changes: Partial<Pick<MemoryRecord, "content" | "metadata">>
  ): MemoryRecord {
    const existing = this.memories.get(id);

    if (!existing) {
      throw new Error(`Memory "${id}" was not found.`);
    }

    const updated: MemoryRecord = {
      ...existing,
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    this.memories.set(id, updated);
    return updated;
  }

  get(id: string): MemoryRecord | undefined {
    return this.memories.get(id);
  }

  list(query: Omit<MemoryQuery, "query">): MemoryRecord[] {
    return Array.from(this.memories.values()).filter((memory) => {
      if (memory.userId !== query.userId) return false;
      if (query.type && memory.type !== query.type) return false;
      if (query.projectId && memory.projectId !== query.projectId) return false;
      if (query.workflowId && memory.workflowId !== query.workflowId) return false;
      return true;
    });
  }

  delete(id: string): boolean {
    return this.memories.delete(id);
  }
}
