import {
  AgentIdentity,
  AgentTask,
  AgentTaskResult,
  AgentTransport,
} from "./types";

export class AgentClient {
  private connected = false;
  private unsubscribe?: () => void;

  constructor(
    private readonly identity: AgentIdentity,
    private readonly transport: AgentTransport
  ) {}

  async connect(
    onTask: (task: AgentTask) => Promise<AgentTaskResult>
  ): Promise<void> {
    if (this.connected) {
      return;
    }

    await this.transport.connect();

    this.unsubscribe = this.transport.onMessage(async (message) => {
      const task = this.parseTask(message);

      if (!task) {
        return;
      }

      const result = await onTask(task);

      await this.sendTaskResult(result);
    });

    this.connected = true;

    await this.send({
      type: "agent.connected",
      agent: this.identity,
      timestamp: new Date().toISOString(),
    });
  }

  async heartbeat(status: string): Promise<void> {
    if (!this.connected) {
      return;
    }

    await this.send({
      type: "agent.heartbeat",
      agentId: this.identity.id,
      status,
      timestamp: new Date().toISOString(),
    });
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    this.unsubscribe?.();
    this.unsubscribe = undefined;

    await this.send({
      type: "agent.disconnected",
      agentId: this.identity.id,
      timestamp: new Date().toISOString(),
    });

    await this.transport.disconnect();
    this.connected = false;
  }

  private async send(message: unknown): Promise<void> {
    await this.transport.send(message);
  }

  private async sendTaskResult(result: AgentTaskResult): Promise<void> {
    await this.send({
      type: "agent.task.result",
      agentId: this.identity.id,
      result,
    });
  }

  private parseTask(message: unknown): AgentTask | undefined {
    if (!message || typeof message !== "object") {
      return undefined;
    }

    const candidate = message as Record<string, unknown>;

    if (
      candidate.type !== "agent.task" ||
      typeof candidate.taskId !== "string"
    ) {
      return undefined;
    }

    const payload =
      candidate.payload &&
      typeof candidate.payload === "object"
        ? (candidate.payload as Record<string, unknown>)
        : {};

    return {
      id: candidate.taskId,
      type: typeof candidate.taskType === "string"
        ? candidate.taskType
        : "unknown",
      payload,
      requiresApproval:
        typeof candidate.requiresApproval === "boolean"
          ? candidate.requiresApproval
          : undefined,
      metadata:
        candidate.metadata &&
        typeof candidate.metadata === "object"
          ? (candidate.metadata as Record<string, unknown>)
          : undefined,
    };
  }
}
