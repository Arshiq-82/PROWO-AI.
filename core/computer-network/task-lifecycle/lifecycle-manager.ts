import { TaskLifecycleStateMachine } from "./state-machine";
import { LifecycleEventFactory } from "./lifecycle-events";
import {
  LifecycleResult,
  TaskLifecycleEvent,
  TaskLifecycleEventType,
  TaskLifecycleRecord,
  TaskLifecycleState,
} from "./types";

export class TaskLifecycleManager {
  private readonly records = new Map<string, TaskLifecycleRecord>();
  private readonly eventHistory = new Map<string, TaskLifecycleEvent[]>();

  constructor(
    private readonly stateMachine: TaskLifecycleStateMachine = new TaskLifecycleStateMachine(),
    private readonly eventFactory: LifecycleEventFactory = new LifecycleEventFactory()
  ) {}

  create(taskId: string, metadata?: Record<string, unknown>): LifecycleResult {
    if (!taskId.trim()) {
      return { success: false, reason: "taskId is required." };
    }

    if (this.records.has(taskId)) {
      return { success: false, reason: "Task lifecycle already exists." };
    }

    const record: TaskLifecycleRecord = {
      taskId,
      state: "created",
      version: 1,
      updatedAt: new Date().toISOString(),
      metadata,
    };

    this.records.set(taskId, record);

    const event = this.eventFactory.create(taskId, "task.created", "created", {
      metadata,
    });
    this.appendEvent(taskId, event);

    return { success: true, record: { ...record }, event };
  }

  transition(
    taskId: string,
    eventType: TaskLifecycleEventType,
    options: {
      reason?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ): LifecycleResult {
    const current = this.records.get(taskId);

    if (!current) {
      return { success: false, reason: "Task lifecycle was not found." };
    }

    const nextState = this.stateMachine.transition(current.state, eventType);

    if (!nextState) {
      return {
        success: false,
        reason: `Invalid transition: ${current.state} -> ${eventType}.`,
      };
    }

    const event = this.eventFactory.create(taskId, eventType, nextState, {
      from: current.state,
      reason: options.reason,
      metadata: options.metadata,
    });

    const updated: TaskLifecycleRecord = {
      ...current,
      state: nextState,
      version: current.version + 1,
      updatedAt: event.timestamp,
      error:
        nextState === "failed"
          ? options.reason ?? current.error
          : nextState === "running" || nextState === "completed"
            ? undefined
            : current.error,
      metadata: {
        ...(current.metadata ?? {}),
        ...(options.metadata ?? {}),
      },
    };

    this.records.set(taskId, updated);
    this.appendEvent(taskId, event);

    return {
      success: true,
      record: { ...updated, metadata: { ...(updated.metadata ?? {}) } },
      event,
    };
  }

  get(taskId: string): TaskLifecycleRecord | undefined {
    const record = this.records.get(taskId);
    return record
      ? { ...record, metadata: { ...(record.metadata ?? {}) } }
      : undefined;
  }

  history(taskId: string): TaskLifecycleEvent[] {
    return (this.eventHistory.get(taskId) ?? []).map((event) => ({
      ...event,
      metadata: { ...(event.metadata ?? {}) },
    }));
  }

  private appendEvent(taskId: string, event: TaskLifecycleEvent): void {
    const events = this.eventHistory.get(taskId) ?? [];
    events.push(event);
    this.eventHistory.set(taskId, events);
  }
}
