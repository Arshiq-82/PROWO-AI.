import {
  OrchestratorTargetExecutor,
  OrchestratorExecutors,
} from "./orchestrator-runtime";
import { ExecutionTarget } from "./runtime-types";

export class TargetExecutorRegistry {
  private readonly executors = new Map<
    ExecutionTarget,
    OrchestratorTargetExecutor
  >();

  register(target: ExecutionTarget, executor: OrchestratorTargetExecutor): void {
    this.executors.set(target, executor);
  }

  unregister(target: ExecutionTarget): boolean {
    return this.executors.delete(target);
  }

  get(target: ExecutionTarget): OrchestratorTargetExecutor | undefined {
    return this.executors.get(target);
  }

  has(target: ExecutionTarget): boolean {
    return this.executors.has(target);
  }

  list(): ExecutionTarget[] {
    return [...this.executors.keys()];
  }

  snapshot(): OrchestratorExecutors {
    const snapshot: OrchestratorExecutors = {};
    for (const [target, executor] of this.executors) {
      snapshot[target] = executor;
    }
    return snapshot;
  }
}
