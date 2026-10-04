import { SchedulingPolicy, SchedulingPriority } from "./types";

export class SchedulingPolicyManager {
  private policy: SchedulingPolicy = {
    priorityWeights: { critical: 100, high: 75, normal: 50, low: 25 },
    maxRetries: 3,
    allowPreemption: false,
    preferPreferredDevice: true,
  };

  get(): SchedulingPolicy {
    return {
      ...this.policy,
      priorityWeights: { ...this.policy.priorityWeights },
    };
  }

  update(changes: Partial<SchedulingPolicy>): SchedulingPolicy {
    const next = {
      ...this.policy,
      ...changes,
      priorityWeights: {
        ...this.policy.priorityWeights,
        ...(changes.priorityWeights ?? {}),
      },
    };
    this.validate(next);
    this.policy = next;
    return this.get();
  }

  priorityScore(priority: SchedulingPriority): number {
    return this.policy.priorityWeights[priority];
  }

  private validate(policy: SchedulingPolicy): void {
    if (policy.maxRetries < 0) {
      throw new Error("maxRetries cannot be negative.");
    }
    for (const value of Object.values(policy.priorityWeights)) {
      if (value < 0) {
        throw new Error("Priority weights cannot be negative.");
      }
    }
  }
}
