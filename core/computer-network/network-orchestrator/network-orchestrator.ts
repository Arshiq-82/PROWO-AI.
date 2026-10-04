import { DistributedQueueManager } from "../distributed-queue/queue-manager";
import { DistributedScheduler } from "../distributed-scheduler/scheduler";
import { SchedulingPolicyManager } from "../distributed-scheduler/scheduling-policy";
import { TaskExecutionCoordinator, ExecutionDispatcher } from "../task-coordination/execution-coordinator";
import { TaskLifecycleManager } from "../task-lifecycle/lifecycle-manager";
import { ExecutionResultCoordinator } from "../task-coordination/result-coordinator";
import { DeviceCapacity } from "../distributed-scheduler/types";
import { NetworkTaskRequest, NetworkOperationResult } from "./types";
import { NetworkTaskRouter } from "./task-router";

export class ComputerNetworkOrchestrator {
  private readonly queue: DistributedQueueManager;
  private readonly policy: SchedulingPolicyManager;
  private readonly scheduler: DistributedScheduler;
  private readonly lifecycle: TaskLifecycleManager;
  private readonly coordinator: TaskExecutionCoordinator;
  private readonly results: ExecutionResultCoordinator;
  private readonly router: NetworkTaskRouter;

  constructor(dispatcher?: ExecutionDispatcher) {
    this.queue = new DistributedQueueManager();
    this.policy = new SchedulingPolicyManager();
    this.scheduler = new DistributedScheduler(this.policy);
    this.lifecycle = new TaskLifecycleManager();
    this.coordinator = new TaskExecutionCoordinator(
      undefined,
      dispatcher
    );
    this.results = new ExecutionResultCoordinator();
    this.router = new NetworkTaskRouter(
      this.queue,
      this.scheduler,
      this.coordinator,
      this.lifecycle
    );
  }

  submit(
    request: NetworkTaskRequest,
    devices: DeviceCapacity[]
  ): Promise<NetworkOperationResult> {
    return this.router.submit(request, devices);
  }

  getTaskState(taskId: string) {
    return this.lifecycle.get(taskId);
  }

  getTaskHistory(taskId: string) {
    return this.lifecycle.history(taskId);
  }

  getQueueStats() {
    return this.queue.stats();
  }

  getAssignments() {
    return this.coordinator.listAssignments();
  }

  getResults() {
    return this.results.list();
  }
}
