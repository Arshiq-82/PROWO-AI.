export type MemoryType =
  | "conversation"
  | "project"
  | "workflow"
  | "preference"
  | "fact"
  | "artifact";

export interface MemoryRecord {
  id: string;
  userId: string;
  type: MemoryType;
  content: string;
  projectId?: string;
  workflowId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface MemoryQuery {
  userId: string;
  query: string;
  type?: MemoryType;
  projectId?: string;
  workflowId?: string;
  limit?: number;
}

export interface MemoryMatch {
  memory: MemoryRecord;
  score: number;
}

export interface ContextBundle {
  memories: MemoryMatch[];
  text: string;
}
