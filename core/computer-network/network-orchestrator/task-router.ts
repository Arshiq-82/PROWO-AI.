import { DistributedScheduler } from "../distributed-scheduler/scheduler";
import { DeviceCapacity, SchedulingTask } from "../distributed-scheduler/types";
import { DistributedQueueManager } from "../distributed-queue/queue-manager";
import { QueueTask } from "../distributed-queue/types";
import { TaskLifecycleManager } from "../task-lifecycle/lifecycle-manager";
import { TaskExecutionCoordinator } from "../task-coordination/execution-coordinator";
import { CoordinationTask } from "../task-coordination/types";
import { NetworkTaskRequest, NetworkOperationResult } from "./types";

export class NetworkTaskRouter {
  constructor(
    private readonly queue: DistributedQueueManager,
    private readonly scheduler: DistributedScheduler,
    private readonly coordinator: TaskExecutionCoordinator,
    private readonly lifecycle: TaskLifecycleManager
  ) {}

  async submit(
    request: NetworkTaskRequest,
    devices: DeviceCapacity[]
  ): Promise<NetworkOperationResult> {
    const created = this.lifecycle.create(request.taskId, request.metadata);

    if (!created.success) {
      return {
        accepted: false,
        taskId: request.taskId,
        status: "failed",
        reason: created.reason,
      };
    }

    const queueTask: QueueTask = {
      taskId: request.taskId,
      priority: request.priority,
      payload: request.payload,
      maxAttempts: request.maxAttempts,
      timeoutMs: request.timeoutMs,
      metadata: request.metadata,
    };

    const queued = this.queue.enqueue(queueTask);
    if (!queued.success) {
      return {
        accepted: false,
        taskId: request.taskId,
        status: "failed",
        reason: queued.reason,
      };
    }

    this.lifecycle.transition(request.taskId, "task.queued");

    const schedulingTask: SchedulingTask = {
      taskId: request.taskId,
      priority: request.priority,
      requiredCapabilities: request.requiredCapabilities,
      preferredDeviceId: request.preferredDeviceId,
      maxRetries: request.maxAttempts,
      timeoutMs: request.timeoutMs,
      metadata: request.metadata,
    };

    const scheduled = this.scheduler.schedule(schedulingTask, devices);
    if (!scheduled.accepted || !scheduled.allocation) {
      return {
        accepted: false,
        taskId: request.taskId,
        status: "queued",
        reason: scheduled.reason,
      };
    }

    this.lifecycle.transition(request.taskId, "task.planned");
    this.lifecycle.transition(request.taskId, "task.scheduled");
    this.lifecycle.transition(request.taskId, "task.allocated");

    const coordinationTask: CoordinationTask = {
      taskId: request.taskId,
      priority: request.priority,
      deviceId: scheduled.allocation.deviceId,
      maxAttempts: request.maxAttempts,
      timeoutMs: request.timeoutMs,
      payload: request.payload,
      metadata: request.metadata,
    };

    const coordinated = await this.coordinator.coordinate(coordinationTask);

    if (!coordinated.accepted) {
      return {
        accepted: false,
        taskId: request.taskId,
        deviceId: scheduled.allocation.deviceId,
        status: "failed",
        reason: coordinated.reason,
      };
    }

    this.lifecycle.transition(request.taskId, "task.dispatched");
    this.lifecycle.transition(request.taskId, "task.started");

    return {
      accepted: true,
      taskId: request.taskId,
      deviceId: scheduled.allocation.deviceId,
      status: "dispatched",
    };
  }
}
