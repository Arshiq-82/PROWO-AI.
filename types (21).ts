export type AgentStatus =
  | "starting"
  | "online"
  | "busy"
  | "offline"
  | "error";

export interface AgentIdentity {
  id: string;
  userId: string;
  name: string;
  platform: "windows" | "macos" | "linux" | "other";
  version: string;
  capabilities: string[];
}

export interface AgentState {
  identity: AgentIdentity;
  status: AgentStatus;
  connectedAt?: string;
  lastHeartbeatAt?: string;
  activeTaskId?: string;
  error?: string;
}

export interface AgentTask {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  requiresApproval?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AgentTaskResult {
  taskId: string;
  success: boolean;
  output?: unknown;
  error?: string;
  startedAt: string;
  completedAt: string;
}

export interface AgentTransport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(message: unknown): Promise<void>;
  onMessage(listener: (message: unknown) => void): () => void;
}
