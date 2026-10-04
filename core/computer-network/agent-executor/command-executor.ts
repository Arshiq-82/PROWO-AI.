import { AgentCommand } from "../protocol/types";
import {
  AgentExecutionContext,
  AgentExecutionRequest,
  AgentExecutionResult,
  AgentCommandExecutor,
} from "./types";
import { AgentExecutionRouter } from "./execution-router";

export interface CommandHandler {
  execute(
    command: AgentCommand,
    context: AgentExecutionContext
  ): Promise<unknown>;
}

export class DefaultAgentCommandExecutor
  implements AgentCommandExecutor
{
  private readonly handlers = new Map<
    string,
    CommandHandler
  >();

  constructor(
    private readonly router: AgentExecutionRouter
  ) {}

  registerHandler(
    name: string,
    handler: CommandHandler
  ): void {
    if (!name.trim()) {
      throw new Error("Handler name is required.");
    }

    this.handlers.set(name, handler);
  }

  async execute(
    request: AgentExecutionRequest
  ): Promise<AgentExecutionResult> {
    const startedAt = new Date().toISOString();

    try {
      if (!request.context.approved) {
        return {
          success: false,
          taskId: request.command.taskId,
          error: "Command has not been approved.",
          startedAt,
          completedAt: new Date().toISOString(),
        };
      }

      const route = this.router.resolve(
        request.command.type
      );

      if (!route) {
        return {
          success: false,
          taskId: request.command.taskId,
          error: `No execution route for command "${request.command.type}".`,
          startedAt,
          completedAt: new Date().toISOString(),
        };
      }

      const handler = this.handlers.get(route.handler);

      if (!handler) {
        return {
          success: false,
          taskId: request.command.taskId,
          error: `Execution handler "${route.handler}" is not registered.`,
          startedAt,
          completedAt: new Date().toISOString(),
        };
      }

      const output = await handler.execute(
        request.command,
        request.context
      );

      return {
        success: true,
        taskId: request.command.taskId,
        output,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        taskId: request.command.taskId,
        error:
          error instanceof Error
            ? error.message
            : "Agent command execution failed.",
        startedAt,
        completedAt: new Date().toISOString(),
      };
    }
  }
}
