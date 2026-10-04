import {
  TargetExecutionContext,
  TargetExecutionOutput,
  TargetExecutor,
  WorkflowExecutionAdapter,
} from "./types";

export class WorkflowTargetExecutor implements TargetExecutor {
  readonly target = "workflow" as const;

  constructor(private readonly adapter: WorkflowExecutionAdapter) {}

  async execute(
    context: TargetExecutionContext
  ): Promise<TargetExecutionOutput> {
    try {
      const output = await this.adapter.execute(context);

      return {
        target: this.target,
        success: true,
        output,
      };
    } catch (error) {
      return {
        target: this.target,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
