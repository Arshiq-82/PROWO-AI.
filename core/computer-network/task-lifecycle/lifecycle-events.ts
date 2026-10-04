import { randomUUID } from "node:crypto";
import {
  TaskLifecycleEvent,
  TaskLifecycleEventType,
  TaskLifecycleState,
} from "./types";

export class LifecycleEventFactory {
  create(
    taskId: string,
    type: TaskLifecycleEventType,
    to: TaskLifecycleState,
    options: {
      from?: TaskLifecycleState;
      reason?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ): TaskLifecycleEvent {
    return {
      eventId: randomUUID(),
      taskId,
      type,
      from: options.from,
      to,
      timestamp: new Date().toISOString(),
      reason: options.reason,
      metadata: options.metadata,
    };
  }
}
