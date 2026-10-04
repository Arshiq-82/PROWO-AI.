export type SchedulingPriority =
  | "critical" | "high" | "normal" | "low";

export type AllocationStatus =
  | "pending" | "allocated" | "running"
  | "completed" | "failed" | "cancelled";

export interface SchedulingTask {
  taskId: string;
  priority: SchedulingPriority;
  requiredCapabilities?: string[];
  preferredDeviceId?: string;
  maxRetries?: number;
  timeoutMs?: number;
  metadata?: Record<string, unknown>;
}

export interface DeviceCapacity {
  deviceId: string;
  maxConcurrentTasks: number;
  activeTasks: number;
  available: boolean;
}

export interface TaskAllocation {
  taskId: string;
  deviceId: string;
  priority: SchedulingPriority;
  status: AllocationStatus;
  attempt: number;
  allocatedAt: string;
}

export interface SchedulingPolicy {
  priorityWeights: Record<SchedulingPriority, number>;
  maxRetries: number;
  allowPreemption: boolean;
  preferPreferredDevice: boolean;
}

export interface SchedulerResult {
  accepted: boolean;
  allocation?: TaskAllocation;
  reason?: string;
}
