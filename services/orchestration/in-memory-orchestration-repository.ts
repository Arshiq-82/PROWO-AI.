import {
  OrchestrationRecord,
  OrchestrationRecordRepository,
} from "./orchestration-record-types";

export class InMemoryOrchestrationRepository
  implements OrchestrationRecordRepository
{
  private readonly records = new Map<string, OrchestrationRecord>();

  async create(record: OrchestrationRecord): Promise<OrchestrationRecord> {
    if (this.records.has(record.requestId)) {
      throw new Error(`Orchestration request already exists: ${record.requestId}`);
    }

    this.records.set(record.requestId, { ...record });
    return { ...record };
  }

  async get(requestId: string): Promise<OrchestrationRecord | undefined> {
    const record = this.records.get(requestId);
    return record ? { ...record } : undefined;
  }

  async update(
    requestId: string,
    patch: Partial<OrchestrationRecord>
  ): Promise<OrchestrationRecord | undefined> {
    const current = this.records.get(requestId);

    if (!current) {
      return undefined;
    }

    const updated: OrchestrationRecord = {
      ...current,
      ...patch,
      requestId: current.requestId,
      updatedAt: new Date().toISOString(),
    };

    this.records.set(requestId, updated);
    return { ...updated };
  }
}
