export type ExecutionStatus =
  | "queued"
  | "starting"
  | "running"
  | "completed"
  | "failed"
  | "timed_out"
  | "cancelled";

export interface ExecutionRequest {
  id: string;
  projectId: string;
  command: string;
  workingDirectory: string;
  environment?: Record<string, string>;
  timeoutMs?: number;
  allowNetwork?: boolean;
}

export interface ExecutionLog {
  timestamp: string;
  stream: "stdout" | "stderr" | "system";
  message: string;
}

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  exitCode?: number;
  startedAt: string;
  finishedAt: string;
  logs: ExecutionLog[];
  error?: string;
}

export interface ProcessHandle {
  id: string;
  pid?: number;
  status: ExecutionStatus;
  startedAt: string;
}

export interface SandboxPolicy {
  allowNetwork: boolean;
  allowedWorkingDirectories: string[];
  maxExecutionTimeMs: number;
  maxOutputBytes: number;
}
