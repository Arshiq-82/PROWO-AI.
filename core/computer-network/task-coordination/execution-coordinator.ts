import { randomUUID } from "node:crypto";
import { CoordinationPolicyManager } from "./coordination-policy";
import {
  CoordinationResult,
  CoordinationTask,
  ExecutionAssignment,
} from "./types";

export interface ExecutionDispatcher {
  dispatch(
    task: CoordinationTask,
    assignment: ExecutionAssignment
  ): Promise<boolean> | boolean;
}

export class TaskExecutionCoordinator {
  private readonly assignments = new Map<string, ExecutionAssignment>();

  constructor(
    private readonly policy: CoordinationPolicyManager = new CoordinationPolicyManager(),
    private readonly dispatcher?: ExecutionDispatcher
  ) {}

  async coordinate(task: CoordinationTask): Promise<CoordinationResult> {
    if (!task.taskId.trim()) {
      return { accepted: false, reason: "taskId is required." };
    }

    if (this.policy.get().requireDevice && !task.deviceId?.trim()) {
      return { accepted: false, reason: "A target device is required." };
    }

    if (!task.deviceId) {
      return { accepted: false, reason: "No execution device was provided." };
    }

    const existing = this.assignments.get(task.taskId);
    const attempt = existing ? existing.attempt + 1 : 1;

    if (attempt > this.policy.attemptsFor(task)) {
      return { accepted: false, reason: "Maximum execution attempts reached." };
    }

    const assignment: ExecutionAssignment = {
      taskId: task.taskId,
      deviceId: task.deviceId,
      attempt,
      assignedAt: new Date().toISOString(),
      status: "dispatching",
    };

    this.assignments.set(task.taskId, assignment);

    if (this.dispatcher) {
      const accepted = await this.dispatcher.dispatch(task, assignment);

      if (!accepted) {
        assignment.status = this.policy.shouldRetry(task, attempt)
          ? "retrying"
          : "failed";
        this.assignments.set(task.taskId, { ...assignment });

        return {
          accepted: false,
          assignment: { ...assignment },
          reason: "Execution dispatcher rejected the task.",
        };
      }
    }

    assignment.status = "running";
    this.assignments.set(task.taskId, { ...assignment });

    return { accepted: true, assignment: { ...assignment } };
  }

  getAssignment(taskId: string): ExecutionAssignment | undefined {
    const assignment = this.assignments.get(taskId);
    return assignment ? { ...assignment } : undefined;
  }

  listAssignments(): ExecutionAssignment[] {
    return [...this.assignments.values()].map((assignment) => ({
      ...assignment,
    }));
  }

  complete(taskId: string): ExecutionAssignment | undefined {
    return this.updateStatus(taskId, "completed");
  }

  fail(taskId: string, retry = false): ExecutionAssignment | undefined {
    return this.updateStatus(taskId, retry ? "retrying" : "failed");
  }

  cancel(taskId: string): ExecutionAssignment | undefined {
    return this.updateStatus(taskId, "cancelled");
  }

  private updateStatus(
    taskId: string,
    status: ExecutionAssignment["status"]
  ): ExecutionAssignment | undefined {
    const assignment = this.assignments.get(taskId);
    if (!assignment) return undefined;

    const updated = { ...assignment, status };
    this.assignments.set(taskId, updated);
    return { ...updated };
  }
}
