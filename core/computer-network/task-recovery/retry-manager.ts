import { RecoveryTask } from "./types";

export interface RetryPolicy {
  baseDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
  jitter: boolean;
}

export class RetryManager {
  private policy: RetryPolicy = {
    baseDelayMs: 1_000,
    maxDelayMs: 60_000,
    backoffMultiplier: 2,
    jitter: true,
  };

  getPolicy(): RetryPolicy {
    return { ...this.policy };
  }

  updatePolicy(changes: Partial<RetryPolicy>): RetryPolicy {
    const next = { ...this.policy, ...changes };

    if (next.baseDelayMs < 0 || next.maxDelayMs < 0) {
      throw new Error("Retry delays cannot be negative.");
    }

    if (next.backoffMultiplier < 1) {
      throw new Error("backoffMultiplier must be at least 1.");
    }

    this.policy = next;
    return this.getPolicy();
  }

  shouldRetry(task: RecoveryTask): boolean {
    return task.attempt < task.maxAttempts;
  }

  delayForAttempt(attempt: number): number {
    const exponential = Math.min(
      this.policy.maxDelayMs,
      this.policy.baseDelayMs *
        Math.pow(this.policy.backoffMultiplier, Math.max(0, attempt - 1))
    );

    if (!this.policy.jitter) return exponential;

    const jitter = Math.floor(exponential * 0.2 * Math.random());
    return Math.min(this.policy.maxDelayMs, exponential + jitter);
  }
}
