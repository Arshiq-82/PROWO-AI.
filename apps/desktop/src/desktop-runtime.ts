import { AgentBridge } from "./agent-bridge";
import {
  DesktopConfig,
  DesktopState,
  LocalOperationRequest,
  LocalOperationResult,
} from "./types";

export class DesktopRuntime {
  private state: DesktopState;

  constructor(
    private readonly config: DesktopConfig,
    private readonly agent: AgentBridge
  ) {
    this.state = {
      status: "stopped",
      userId: config.userId,
      deviceId: config.deviceId,
      agentRunning: false,
    };
  }

  getState(): DesktopState {
    return { ...this.state };
  }

  async start(): Promise<void> {
    if (this.state.status === "ready") {
      return;
    }

    this.state.status = "starting";
    this.state.error = undefined;

    try {
      if (this.config.autoStartAgent !== false) {
        await this.agent.start();
      }

      this.state.agentRunning = this.agent.isRunning();
      this.state.status = "ready";
      this.state.startedAt = new Date().toISOString();
    } catch (error) {
      this.state.status = "error";
      this.state.error =
        error instanceof Error
          ? error.message
          : "Desktop runtime failed to start.";

      throw error;
    }
  }

  async stop(): Promise<void> {
    await this.agent.stop();

    this.state.agentRunning = false;
    this.state.status = "stopped";
  }

  async executeLocalOperation(
    request: LocalOperationRequest
  ): Promise<LocalOperationResult> {
    if (this.state.status !== "ready") {
      return {
        success: false,
        error: "Desktop runtime is not ready.",
      };
    }

    this.state.status = "busy";

    try {
      return await this.agent.execute(request);
    } finally {
      this.state.status = "ready";
    }
  }
}
