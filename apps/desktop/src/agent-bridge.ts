import {
  LocalOperationRequest,
  LocalOperationResult,
} from "./types";

export interface AgentBridge {
  start(): Promise<void>;
  stop(): Promise<void>;
  isRunning(): boolean;
  execute(
    request: LocalOperationRequest
  ): Promise<LocalOperationResult>;
}

export class DesktopAgentBridge implements AgentBridge {
  private running = false;

  async start(): Promise<void> {
    if (this.running) {
      return;
    }

    // Agent process startup will be connected here.
    this.running = true;
  }

  async stop(): Promise<void> {
    if (!this.running) {
      return;
    }

    // Agent process shutdown will be connected here.
    this.running = false;
  }

  isRunning(): boolean {
    return this.running;
  }

  async execute(
    request: LocalOperationRequest
  ): Promise<LocalOperationResult> {
    if (!this.running) {
      return {
        success: false,
        error: "Desktop agent is not running.",
      };
    }

    // Local operations will be routed through the
    // permission and execution layers before real execution.
    return {
      success: false,
      error: `Local operation "${request.type}" is not connected yet.`,
    };
  }
}
