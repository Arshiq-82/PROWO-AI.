import {
  AgentCommand,
  AgentEvent,
} from "../protocol/types";
import {
  CommandDispatchResult,
  CommandRoute,
} from "./types";

export interface CommandTransport {
  send(command: AgentCommand): Promise<void>;
}

export class CommandRouter {
  constructor(
    private readonly transport: CommandTransport
  ) {}

  async dispatch(
    command: AgentCommand
  ): Promise<CommandDispatchResult> {
    try {
      await this.transport.send(command);

      return {
        accepted: true,
        commandId: command.id,
        deviceId: command.deviceId,
        taskId: command.taskId,
      };
    } catch (error) {
      return {
        accepted: false,
        commandId: command.id,
        deviceId: command.deviceId,
        taskId: command.taskId,
        error:
          error instanceof Error
            ? error.message
            : "Command dispatch failed.",
      };
    }
  }

  createRoute(command: AgentCommand): CommandRoute {
    return {
      commandType: command.type,
      deviceId: command.deviceId,
      taskId: command.taskId,
      command,
      createdAt: new Date().toISOString(),
    };
  }

  canRouteEvent(event: AgentEvent): boolean {
    return Boolean(event.deviceId);
  }
}
