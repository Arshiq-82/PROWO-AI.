import { AgentClient } from "./agent-client";
import { AgentTaskHandler } from "./task-handler";
import {
  AgentIdentity,
  AgentState,
} from "./types";

export class AgentRuntime {
  readonly handler: AgentTaskHandler;
  private state: AgentState;

  constructor(
    identity: AgentIdentity,
    private readonly client: AgentClient
  ) {
    this.handler = new AgentTaskHandler();

    this.state = {
      identity,
      status: "starting",
    };
  }

  getState(): AgentState {
    return {
      ...this.state,
      identity: {
        ...this.state.identity,
        capabilities: [...this.state.identity.capabilities],
      },
    };
  }

  async start(): Promise<void> {
    this.state.status = "starting";

    await this.client.connect(async (task) => {
      this.state.status = "busy";
      this.state.activeTaskId = task.id;

      const result = await this.handler.execute(task);

      this.state.activeTaskId = undefined;
      this.state.status = result.success ? "online" : "error";
      this.state.error = result.success ? undefined : result.error;

      return result;
    });

    this.state.status = "online";
    this.state.connectedAt = new Date().toISOString();
    this.state.lastHeartbeatAt = this.state.connectedAt;
  }

  async heartbeat(): Promise<void> {
    await this.client.heartbeat(this.state.status);
    this.state.lastHeartbeatAt = new Date().toISOString();
  }

  async stop(): Promise<void> {
    await this.client.disconnect();

    this.state.status = "offline";
    this.state.activeTaskId = undefined;
  }
}
