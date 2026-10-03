import {
  AgentEvent,
  AgentEventType,
} from "./types";

export class AgentEventParser {
  parse<T = unknown>(raw: unknown): AgentEvent<T> {
    if (!raw || typeof raw !== "object") {
      throw new Error("Agent event must be an object.");
    }

    const event = raw as Record<string, unknown>;

    if (
      typeof event.id !== "string" ||
      typeof event.type !== "string" ||
      typeof event.timestamp !== "string" ||
      typeof event.deviceId !== "string"
    ) {
      throw new Error(
        "Agent event requires id, type, timestamp, and deviceId."
      );
    }

    const validTypes: AgentEventType[] = [
      "task_started",
      "task_progress",
      "task_completed",
      "task_failed",
      "device_status",
      "log",
      "error",
    ];

    if (!validTypes.includes(event.type as AgentEventType)) {
      throw new Error(
        `Unsupported agent event type: ${event.type}`
      );
    }

    return event as unknown as AgentEvent<T>;
  }

  isTaskEvent(event: AgentEvent): boolean {
    return (
      event.type === "task_started" ||
      event.type === "task_progress" ||
      event.type === "task_completed" ||
      event.type === "task_failed"
    );
  }

  isError(event: AgentEvent): boolean {
    return event.type === "error" ||
      event.type === "task_failed";
  }
}
