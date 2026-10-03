import { ProcessManager } from "./process-manager";
import { SandboxPolicyManager } from "./sandbox";
import {
  ExecutionRequest,
  ExecutionResult,
} from "./types";

export class ExecutionEngine {
  constructor(
    private readonly processManager = new ProcessManager(),
    private readonly sandbox = new SandboxPolicyManager()
  ) {}

  async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    const startedAt = new Date().toISOString();

    try {
      this.sandbox.validateWorkingDirectory(request.workingDirectory);
      this.sandbox.validateTimeout(request.timeoutMs);
      this.sandbox.validateNetworkAccess(request.allowNetwork);

      const handle = await this.processManager.start(request);

      if (handle.status === "queued") {
        return await this.processManager.wait(handle);
      }

      return await this.processManager.wait(handle);
    } catch (error) {
      return {
        id: request.id,
        status: "failed",
        startedAt,
        finishedAt: new Date().toISOString(),
        logs: [],
        error:
          error instanceof Error
            ? error.message
            : "Unknown execution error.",
      };
    }
  }
}
