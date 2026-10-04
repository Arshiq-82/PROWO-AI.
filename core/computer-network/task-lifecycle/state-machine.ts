import {
  TaskLifecycleEventType,
  TaskLifecycleState,
  LifecycleTransition,
} from "./types";

export class TaskLifecycleStateMachine {
  private readonly transitions: LifecycleTransition[] = [
    { from: "created", event: "task.queued", to: "queued" },
    { from: "queued", event: "task.planned", to: "planning" },
    { from: "planning", event: "task.scheduled", to: "scheduled" },
    { from: "scheduled", event: "task.allocated", to: "allocated" },
    { from: "allocated", event: "task.dispatched", to: "dispatched" },
    { from: "dispatched", event: "task.started", to: "running" },
    { from: "running", event: "task.paused", to: "paused" },
    { from: "paused", event: "task.resumed", to: "running" },
    { from: "running", event: "task.completed", to: "completed" },
    { from: "running", event: "task.failed", to: "failed" },
    { from: "failed", event: "task.retrying", to: "retrying" },
    { from: "retrying", event: "task.queued", to: "queued" },
    { from: "created", event: "task.cancelled", to: "cancelled" },
    { from: "queued", event: "task.cancelled", to: "cancelled" },
    { from: "planning", event: "task.cancelled", to: "cancelled" },
    { from: "scheduled", event: "task.cancelled", to: "cancelled" },
    { from: "allocated", event: "task.cancelled", to: "cancelled" },
    { from: "dispatched", event: "task.cancelled", to: "cancelled" },
    { from: "running", event: "task.cancelled", to: "cancelled" },
    { from: "paused", event: "task.cancelled", to: "cancelled" },
  ];

  canTransition(
    from: TaskLifecycleState,
    event: TaskLifecycleEventType
  ): boolean {
    return this.transitions.some(
      (transition) => transition.from === from && transition.event === event
    );
  }

  transition(
    from: TaskLifecycleState,
    event: TaskLifecycleEventType
  ): TaskLifecycleState | undefined {
    return this.transitions.find(
      (transition) => transition.from === from && transition.event === event
    )?.to;
  }

  getTransitions(): LifecycleTransition[] {
    return this.transitions.map((transition) => ({ ...transition }));
  }
}
