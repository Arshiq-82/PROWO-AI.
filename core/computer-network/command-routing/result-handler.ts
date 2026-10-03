import { AgentEvent } from "../protocol/types";
import {
  CommandResultHandler,
  TaskCommandResult,
} from "./types";

export class TaskResultHandler
  implements CommandResultHandler
{
  handle(
    event: AgentEvent
  ): TaskCommandResult | undefined {
    if (
      event.type !== "task_completed" &&
      event.type !== "task_failed"
    ) {
      return undefined;
    }

    if (!event.taskId) {
      return undefined;
    }

    const payload = this.asRecord(event.payload);

    return {
      taskId: event.taskId,
      deviceId: event.deviceId,
      success: event.type === "task_completed",
      output: payload?.output,
      error:
        event.type === "task_failed"
          ? this.extractError(payload)
          : undefined,
      completedAt: event.timestamp,
    };
  }

  private asRecord(
    payload: unknown
  ): Record<string, unknown> | undefined {
    if (
      payload &&
      typeof payload === "object"
    ) {
      return payload as Record<string, unknown>;
    }

    return undefined;
  }

  private extractError(
    payload?: Record<string, unknown>
  ): string {
    if (typeof payload?.error === "string") {
      return payload.error;
    }

    return "Agent task failed.";
  }
}
