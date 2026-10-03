import { AgentCommandBuilder } from "../protocol/command-builder";
import { AgentCommand } from "../protocol/types";
import {
  CommandDispatchResult,
  TaskCommandRequest,
} from "./types";
import { CommandRouter } from "./command-router";

export class TaskCommandService {
  constructor(
    private readonly router: CommandRouter,
    private readonly commands = new AgentCommandBuilder()
  ) {}

  async execute(
    request: TaskCommandRequest
  ): Promise<CommandDispatchResult> {
    this.validate(request);

    const command = this.commands.executeTask(
      request.deviceId,
      request.taskId,
      {
        action: request.action,
        input: request.input,
        timeoutMs: request.timeoutMs,
      }
    );

    return this.router.dispatch(command);
  }

  async cancel(
    deviceId: string,
    taskId: string
  ): Promise<CommandDispatchResult> {
    const command = this.commands.cancelTask(
      deviceId,
      taskId
    );

    return this.router.dispatch(command);
  }

  async collectStatus(
    deviceId: string
  ): Promise<CommandDispatchResult> {
    const command = this.commands.collectStatus(deviceId);
    return this.router.dispatch(command);
  }

  private validate(request: TaskCommandRequest): void {
    if (!request.deviceId.trim()) {
      throw new Error("deviceId is required.");
    }

    if (!request.taskId.trim()) {
      throw new Error("taskId is required.");
    }

    if (!request.action.trim()) {
      throw new Error("action is required.");
    }

    if (
      request.timeoutMs !== undefined &&
      request.timeoutMs <= 0
    ) {
      throw new Error("timeoutMs must be greater than zero.");
    }
  }
}
