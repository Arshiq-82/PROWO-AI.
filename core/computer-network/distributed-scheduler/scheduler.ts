import {
  DeviceCapacity,
  SchedulingTask,
  SchedulerResult,
  TaskAllocation,
} from "./types";
import { SchedulingPolicyManager } from "./scheduling-policy";
import { TaskAllocator } from "./task-allocator";

export class DistributedScheduler {
  private readonly allocations = new Map<string, TaskAllocation>();

  constructor(
    private readonly policy: SchedulingPolicyManager,
    private readonly allocator: TaskAllocator = new TaskAllocator()
  ) {}

  schedule(task: SchedulingTask, devices: DeviceCapacity[]): SchedulerResult {
    if (!task.taskId.trim()) {
      return { accepted: false, reason: "taskId is required." };
    }

    const allocation = this.allocator.allocate(task, devices);
    if (!allocation) {
      return {
        accepted: false,
        reason: "No device currently has available capacity.",
      };
    }

    this.allocations.set(task.taskId, allocation);
    return { accepted: true, allocation };
  }

  get(taskId: string): TaskAllocation | undefined {
    const allocation = this.allocations.get(taskId);
    return allocation ? { ...allocation } : undefined;
  }

  list(): TaskAllocation[] {
    return [...this.allocations.values()].map((allocation) => ({ ...allocation }));
  }

  updateStatus(
    taskId: string,
    status: TaskAllocation["status"]
  ): TaskAllocation | undefined {
    const allocation = this.allocations.get(taskId);
    if (!allocation) return undefined;
    allocation.status = status;
    return { ...allocation };
  }

  retry(taskId: string, maxRetries?: number): TaskAllocation | undefined {
    const allocation = this.allocations.get(taskId);
    if (!allocation) return undefined;

    const limit = maxRetries ?? this.policy.get().maxRetries;
    if (allocation.attempt >= limit + 1) return undefined;

    allocation.attempt += 1;
    allocation.status = "pending";
    return { ...allocation };
  }

  cancel(taskId: string): TaskAllocation | undefined {
    return this.updateStatus(taskId, "cancelled");
  }
}
