export type RecoveryReason =
  | "device_offline"
  | "agent_crash"
  | "timeout"
  | "execution_failure"
  | "dispatch_failure"
  | "unknown";

export type RecoveryAction =
  | "retry_same_device"
  | "reallocate_device"
  | "resume"
  | "fail"
  | "cancel";

export interface RecoveryTask {
  taskId: string;
  deviceId?: string;
  attempt: number;
  maxAttempts: number;
  reason: RecoveryReason;
  checkpoint?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RecoveryDecision {
  taskId: string;
  action: RecoveryAction;
  nextDeviceId?: string;
  nextAttempt: number;
  reason: string;
  createdAt: string;
}

export interface RecoveryResult {
  recovered: boolean;
  decision?: RecoveryDecision;
  reason?: string;
}
