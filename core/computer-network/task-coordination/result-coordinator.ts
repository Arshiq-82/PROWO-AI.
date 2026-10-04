import { ExecutionResult } from "./types";

export interface ResultSink {
  accept(result: ExecutionResult): Promise<void> | void;
}

export class ExecutionResultCoordinator {
  private readonly results = new Map<string, ExecutionResult>();

  constructor(private readonly sink?: ResultSink) {}

  async record(result: ExecutionResult): Promise<ExecutionResult> {
    const normalized: ExecutionResult = {
      ...result,
      completedAt: result.completedAt || new Date().toISOString(),
    };

    this.results.set(result.taskId, normalized);

    if (this.sink) {
      await this.sink.accept({ ...normalized });
    }

    return { ...normalized };
  }

  get(taskId: string): ExecutionResult | undefined {
    const result = this.results.get(taskId);
    return result ? { ...result } : undefined;
  }

  list(): ExecutionResult[] {
    return [...this.results.values()].map((result) => ({ ...result }));
  }

  clear(taskId: string): boolean {
    return this.results.delete(taskId);
  }
}
