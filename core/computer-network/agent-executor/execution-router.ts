import { AgentCommand } from "../protocol/types";
import { ExecutionRoute } from "./types";

export class AgentExecutionRouter {
  private readonly routes = new Map<
    AgentCommand["type"],
    string
  >();

  register(
    commandType: AgentCommand["type"],
    handler: string
  ): void {
    if (!handler.trim()) {
      throw new Error("Execution handler is required.");
    }

    this.routes.set(commandType, handler);
  }

  resolve(
    commandType: AgentCommand["type"]
  ): ExecutionRoute | undefined {
    const handler = this.routes.get(commandType);

    if (!handler) {
      return undefined;
    }

    return {
      commandType,
      handler,
    };
  }

  has(commandType: AgentCommand["type"]): boolean {
    return this.routes.has(commandType);
  }

  list(): ExecutionRoute[] {
    return [...this.routes.entries()].map(
      ([commandType, handler]) => ({
        commandType,
        handler,
      })
    );
  }
}
