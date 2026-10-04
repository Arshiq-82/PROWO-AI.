import {
  AgentEvent,
  AgentEventType,
} from "../protocol/types";
import { AgentExecutionResult } from "./types";

export class AgentResultBuilder {
  taskStarted(
    deviceId: string,
    taskId: string
  ): AgentEvent {
    return this.create(
      "task_started",
      deviceId,
      taskId,
      {}
    );
  }

  taskCompleted(
    deviceId: string,
    taskId: string,
    result: AgentExecutionResult
  ): AgentEvent {
    return this.create(
      "task_completed",
      deviceId,
      taskId,
      {
        output: result.output,
        startedAt: result.startedAt,
        completedAt: result.completedAt,
      }
    );
  }

  taskFailed(
    deviceId: string,
    taskId: string,
    result: AgentExecutionResult
  ): AgentEvent {
    return this.create(
      "task_failed",
      deviceId,
      taskId,
      {
        error: result.error ?? "Task failed.",
        startedAt: result.startedAt,
        completedAt: result.completedAt,
      }
    );
  }

  private create(
    type: AgentEventType,
    deviceId: string,
    taskId: string | undefined,
    payload: unknown
  ): AgentEvent {
    return {
      id: this.createId("evt"),
      type,
      timestamp: new Date().toISOString(),
      deviceId,
      taskId,
      payload,
    };
  }

  private createId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
