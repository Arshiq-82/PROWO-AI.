import {
  AgentCommand,
  AgentCommandType,
} from "./types";

export class AgentCommandBuilder {
  create<T>(
    type: AgentCommandType,
    deviceId: string,
    payload?: T,
    taskId?: string
  ): AgentCommand<T> {
    return {
      id: this.createId("cmd"),
      type,
      timestamp: new Date().toISOString(),
      deviceId,
      taskId,
      payload,
    };
  }

  executeTask(
    deviceId: string,
    taskId: string,
    payload: {
      action: string;
      input?: Record<string, unknown>;
      timeoutMs?: number;
    }
  ): AgentCommand {
    return this.create(
      "execute_task",
      deviceId,
      payload,
      taskId
    );
  }

  cancelTask(
    deviceId: string,
    taskId: string
  ): AgentCommand {
    return this.create(
      "cancel_task",
      deviceId,
      undefined,
      taskId
    );
  }

  collectStatus(deviceId: string): AgentCommand {
    return this.create(
      "collect_status",
      deviceId
    );
  }

  shutdown(deviceId: string): AgentCommand {
    return this.create(
      "shutdown",
      deviceId
    );
  }

  private createId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
