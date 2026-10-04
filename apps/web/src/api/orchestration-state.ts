import {
  OrchestrationClient,
  OrchestrationClientRequest,
  OrchestrationClientResponse,
} from "./orchestration-client";

export interface OrchestrationState {
  status: "idle" | "submitting" | "completed" | "failed" | "awaiting_approval";
  requestId?: string;
  target?: string;
  output?: unknown;
  error?: string;
  approvalId?: string;
}

export class OrchestrationStateManager {
  private state: OrchestrationState = { status: "idle" };

  constructor(private readonly client: OrchestrationClient) {}

  snapshot(): OrchestrationState {
    return { ...this.state };
  }

  async submit(
    request: OrchestrationClientRequest,
    token?: string
  ): Promise<OrchestrationState> {
    this.state = { status: "submitting" };

    try {
      const response = await this.client.submit(request, token);
      const data = response.data;

      this.state = {
        status:
          data.status === "awaiting_approval"
            ? "awaiting_approval"
            : data.status === "completed"
              ? "completed"
              : data.status === "failed"
                ? "failed"
                : "submitting",
        requestId: data.requestId,
        target: data.target,
        output: data.output,
        error: data.error,
        approvalId: data.approvalId,
      };
    } catch (error) {
      this.state = {
        status: "failed",
        error: error instanceof Error ? error.message : "Request failed.",
      };
    }

    return this.snapshot();
  }
}
