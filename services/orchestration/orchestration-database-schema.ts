import { OrchestrationRecord } from "../orchestration/orchestration-record-types";

export const ORCHESTRATION_RECORD_COLLECTION =
  "orchestration_requests";

export const orchestrationRecordSchema = {
  collection: ORCHESTRATION_RECORD_COLLECTION,
  fields: {
    requestId: "string",
    userId: "string",
    projectId: "string?",
    message: "string",
    selectedModel: "string?",
    status: "string",
    target: "string?",
    output: "json?",
    error: "string?",
    approvalId: "string?",
    metadata: "json?",
    createdAt: "datetime",
    updatedAt: "datetime",
  },
} as const;

export function toDatabaseRecord(
  record: OrchestrationRecord
): Record<string, unknown> {
  return {
    id: record.requestId,
    ...record,
  };
}
