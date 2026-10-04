import { SchedulingPriority, DeviceCapacity, SchedulingTask } from "../distributed-scheduler/types";
import { CoordinationTask, ExecutionResult } from "../task-coordination/types";
import { QueueTask } from "../distributed-queue/types";

export interface NetworkTaskRequest {
  taskId: string;
  priority: SchedulingPriority;
  payload: Record<string, unknown>;
  requiredCapabilities?: string[];
  preferredDeviceId?: string;
  maxAttempts?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface NetworkDispatchContext {
  task: NetworkTaskRequest;
  devices: DeviceCapacity[];
  queueTask: QueueTask;
  schedulingTask: SchedulingTask;
  coordinationTask: CoordinationTask;
}

export interface NetworkOperationResult {
  accepted: boolean;
  taskId: string;
  deviceId?: string;
  status:
    | "queued"
    | "scheduled"
    | "dispatched"
    | "completed"
    | "failed"
    | "retrying"
    | "cancelled";
  reason?: string;
  result?: ExecutionResult;
}
