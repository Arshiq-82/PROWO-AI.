import { CoordinationTask } from "./types";

export interface CoordinationPolicy {
  defaultTimeoutMs: number;
  maxAttempts: number;
  allowRetry: boolean;
  requireDevice: boolean;
}

export class CoordinationPolicyManager {
  private policy: CoordinationPolicy = {
    defaultTimeoutMs: 120_000,
    maxAttempts: 3,
    allowRetry: true,
    requireDevice: true,
  };

  get(): CoordinationPolicy {
    return { ...this.policy };
  }

  update(changes: Partial<CoordinationPolicy>): CoordinationPolicy {
    const next = { ...this.policy, ...changes };
    this.validate(next);
    this.policy = next;
    return this.get();
  }

  attemptsFor(task: CoordinationTask): number {
    return Math.max(1, task.maxAttempts ?? this.policy.maxAttempts);
  }

  timeoutFor(task: CoordinationTask): number {
    return Math.max(1, task.timeoutMs ?? this.policy.defaultTimeoutMs);
  }

  shouldRetry(task: CoordinationTask, attempt: number): boolean {
    return this.policy.allowRetry && attempt < this.attemptsFor(task);
  }

  private validate(policy: CoordinationPolicy): void {
    if (policy.defaultTimeoutMs <= 0) {
      throw new Error("defaultTimeoutMs must be greater than zero.");
    }
    if (policy.maxAttempts <= 0) {
      throw new Error("maxAttempts must be greater than zero.");
    }
  }
}
