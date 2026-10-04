export type OrchestrationRecordStatus =
  | "submitted"
  | "planning"
  | "awaiting_approval"
  | "queued"
  | "running"
  | "completed"
  | "failed";

export interface OrchestrationRecord {
  requestId: string;
  userId: string;
  projectId?: string;
  message: string;
  selectedModel?: string;
  status: OrchestrationRecordStatus;
  target?: string;
  output?: unknown;
  error?: string;
  approvalId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface OrchestrationRecordRepository {
  create(record: OrchestrationRecord): Promise<OrchestrationRecord>;
  get(requestId: string): Promise<OrchestrationRecord | undefined>;
  update(
    requestId: string,
    patch: Partial<OrchestrationRecord>
  ): Promise<OrchestrationRecord | undefined>;
}
