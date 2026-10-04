import { FailoverCandidate, FailoverStrategy } from "./failover-strategy";
import { RetryManager } from "./retry-manager";
import {
  RecoveryDecision,
  RecoveryReason,
  RecoveryResult,
  RecoveryTask,
} from "./types";

export class TaskRecoveryManager {
  private readonly decisions = new Map<string, RecoveryDecision[]>();

  constructor(
    private readonly failover: FailoverStrategy = new FailoverStrategy(),
    private readonly retry: RetryManager = new RetryManager()
  ) {}

  recover(
    task: RecoveryTask,
    candidates: FailoverCandidate[]
  ): RecoveryResult {
    if (!task.taskId.trim()) {
      return { recovered: false, reason: "taskId is required." };
    }

    if (!this.retry.shouldRetry(task)) {
      const decision: RecoveryDecision = {
        taskId: task.taskId,
        action: "fail",
        nextAttempt: task.attempt,
        reason: "Maximum recovery attempts reached.",
        createdAt: new Date().toISOString(),
      };
      this.record(decision);
      return { recovered: false, decision };
    }

    const decision = this.failover.choose(task, candidates);
    this.record(decision);

    return {
      recovered:
        decision.action === "retry_same_device" ||
        decision.action === "reallocate_device" ||
        decision.action === "resume",
      decision,
    };
  }

  classifyReason(error: unknown): RecoveryReason {
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

    if (message.includes("offline")) return "device_offline";
    if (message.includes("agent") && message.includes("crash")) return "agent_crash";
    if (message.includes("timeout")) return "timeout";
    if (message.includes("dispatch")) return "dispatch_failure";
    if (message.includes("execution") || message.includes("exit code")) {
      return "execution_failure";
    }

    return "unknown";
  }

  getHistory(taskId: string): RecoveryDecision[] {
    return (this.decisions.get(taskId) ?? []).map((decision) => ({
      ...decision,
    }));
  }

  getRetryDelay(attempt: number): number {
    return this.retry.delayForAttempt(attempt);
  }

  private record(decision: RecoveryDecision): void {
    const history = this.decisions.get(decision.taskId) ?? [];
    history.push(decision);
    this.decisions.set(decision.taskId, history);
  }
}
