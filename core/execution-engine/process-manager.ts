import {
  ExecutionRequest,
  ExecutionResult,
  ProcessHandle,
} from "./types";

export interface ProcessRunner {
  start(request: ExecutionRequest): Promise<ProcessHandle>;
  wait(handle: ProcessHandle): Promise<ExecutionResult>;
  cancel(handle: ProcessHandle): Promise<void>;
}

/**
 * Platform-neutral process manager contract.
 *
 * The actual OS process adapter will be implemented separately for the
 * Prowo server/desktop/agent environments. This layer deliberately does
 * not execute arbitrary commands yet.
 */
export class ProcessManager implements ProcessRunner {
  async start(request: ExecutionRequest): Promise<ProcessHandle> {
    return {
      id: request.id,
      status: "queued",
      startedAt: new Date().toISOString(),
    };
  }

  async wait(handle: ProcessHandle): Promise<ExecutionResult> {
    const now = new Date().toISOString();

    return {
      id: handle.id,
      status: "failed",
      startedAt: handle.startedAt,
      finishedAt: now,
      logs: [
        {
          timestamp: now,
          stream: "system",
          message:
            "No platform process adapter is connected. Execution was not started.",
        },
      ],
      error: "Process runner is not configured.",
    };
  }

  async cancel(handle: ProcessHandle): Promise<void> {
    void handle;
    await Promise.resolve();
  }
}
