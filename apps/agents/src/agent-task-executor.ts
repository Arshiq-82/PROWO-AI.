export interface AgentExecutionRequest {
  taskId: string;
  action: string;
  payload?: unknown;
  requiresApproval?: boolean;
  approved?: boolean;
}

export interface AgentExecutionResult {
  taskId: string;
  success: boolean;
  output?: unknown;
  error?: string;
}

export interface AgentLocalExecutionPort {
  execute(
    request: AgentExecutionRequest
  ): Promise<AgentExecutionResult>;
}

/**
 * Security boundary between incoming agent commands and local execution.
 * The agent refuses approval-required work unless approval is explicitly
 * present. Actual execution is delegated to the local execution engine.
 */
export class AgentTaskExecutor {
  constructor(
    private readonly localExecution: AgentLocalExecutionPort
  ) {}

  async execute(
    request: AgentExecutionRequest
  ): Promise<AgentExecutionResult> {
    if (request.requiresApproval && !request.approved) {
      return {
        taskId: request.taskId,
        success: false,
        error: "Task requires approval before local execution.",
      };
    }

    return this.localExecution.execute(request);
  }
}
