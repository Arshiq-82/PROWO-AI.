import {
  OrchestrationRecord,
  OrchestrationRecordRepository,
} from "../orchestration/orchestration-record-types";

export interface DatabaseRecord {
  id: string;
  [key: string]: unknown;
}

export interface OrchestrationDatabasePort {
  insert(record: DatabaseRecord): Promise<DatabaseRecord>;
  findById(id: string): Promise<DatabaseRecord | undefined>;
  update(
    id: string,
    patch: Record<string, unknown>
  ): Promise<DatabaseRecord | undefined>;
}

/**
 * Bridges the orchestration repository contract to Prowo's database layer.
 *
 * The database implementation stays outside this adapter. This keeps
 * orchestration persistence independent from the selected database adapter.
 */
export class DatabaseOrchestrationRepository
  implements OrchestrationRecordRepository
{
  constructor(private readonly database: OrchestrationDatabasePort) {}

  async create(record: OrchestrationRecord): Promise<OrchestrationRecord> {
    const stored = await this.database.insert({
      ...record,
      id: record.requestId,
    });

    return this.toRecord(stored);
  }

  async get(requestId: string): Promise<OrchestrationRecord | undefined> {
    const stored = await this.database.findById(requestId);

    return stored ? this.toRecord(stored) : undefined;
  }

  async update(
    requestId: string,
    patch: Partial<OrchestrationRecord>
  ): Promise<OrchestrationRecord | undefined> {
    const stored = await this.database.update(requestId, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });

    return stored ? this.toRecord(stored) : undefined;
  }

  private toRecord(record: DatabaseRecord): OrchestrationRecord {
    return {
      requestId: String(record.requestId ?? record.id),
      userId: String(record.userId ?? ""),
      projectId:
        typeof record.projectId === "string"
          ? record.projectId
          : undefined,
      message: String(record.message ?? ""),
      selectedModel:
        typeof record.selectedModel === "string"
          ? record.selectedModel
          : undefined,
      status: String(record.status ?? "submitted") as OrchestrationRecord["status"],
      target:
        typeof record.target === "string" ? record.target : undefined,
      output: record.output,
      error: typeof record.error === "string" ? record.error : undefined,
      approvalId:
        typeof record.approvalId === "string"
          ? record.approvalId
          : undefined,
      metadata:
        record.metadata &&
        typeof record.metadata === "object"
          ? (record.metadata as Record<string, unknown>)
          : undefined,
      createdAt: String(record.createdAt ?? new Date().toISOString()),
      updatedAt: String(record.updatedAt ?? new Date().toISOString()),
    };
  }
}
