import { ExecutionResultCoordinator } from "../task-coordination/result-coordinator";
import { TaskLifecycleManager } from "../task-lifecycle/lifecycle-manager";
import { NetworkOperationResult } from "./types";

export type NetworkEvent =
  | {
      type: "task.completed";
      taskId: string;
      result?: unknown;
      metadata?: Record<string, unknown>;
    }
  | {
      type: "task.failed";
      taskId: string;
      error: string;
      retryable?: boolean;
      metadata?: Record<string, unknown>;
    }
  | {
      type: "task.cancelled";
      taskId: string;
      reason?: string;
    };

export class NetworkEventHandler {
  constructor(
    private readonly lifecycle: TaskLifecycleManager,
    private readonly results: ExecutionResultCoordinator
  ) {}

  async handle(event: NetworkEvent): Promise<NetworkOperationResult> {
    if (event.type === "task.completed") {
      const lifecycleResult = this.lifecycle.transition(
        event.taskId,
        "task.completed",
        { metadata: event.metadata }
      );

      if (!lifecycleResult.success) {
        return {
          accepted: false,
          taskId: event.taskId,
          status: "failed",
          reason: lifecycleResult.reason,
        };
      }

      await this.results.record({
        taskId: event.taskId,
        success: true,
        output: event.result,
        attempt: 1,
        completedAt: new Date().toISOString(),
        metadata: event.metadata,
      });

      return {
        accepted: true,
        taskId: event.taskId,
        status: "completed",
        result: {
          taskId: event.taskId,
          success: true,
          output: event.result,
          attempt: 1,
          completedAt: new Date().toISOString(),
          metadata: event.metadata,
        },
      };
    }

    if (event.type === "task.failed") {
      const lifecycleEvent = event.retryable
        ? "task.retrying"
        : "task.failed";

      const lifecycleResult = this.lifecycle.transition(
        event.taskId,
        lifecycleEvent,
        { reason: event.error, metadata: event.metadata }
      );

      return {
        accepted: lifecycleResult.success,
        taskId: event.taskId,
        status: event.retryable ? "retrying" : "failed",
        reason: lifecycleResult.reason ?? event.error,
      };
    }

    const lifecycleResult = this.lifecycle.transition(
      event.taskId,
      "task.cancelled",
      { reason: event.reason }
    );

    return {
      accepted: lifecycleResult.success,
      taskId: event.taskId,
      status: "cancelled",
      reason: lifecycleResult.reason ?? event.reason,
    };
  }
}
