import {
  OrchestrationContext,
  OrchestrationResponse,
  OrchestrationServicePort,
  OrchestrationSubmitRequest,
  OrchestratorRuntimePort,
} from "./types";

interface StoredRequest {
  requestId: string;
  message: string;
  context: OrchestrationContext;
}

export class OrchestrationService implements OrchestrationServicePort {
  private readonly requests = new Map<string, StoredRequest>();

  constructor(private readonly orchestrator: OrchestratorRuntimePort) {}

  async submit(
    request: OrchestrationSubmitRequest
  ): Promise<OrchestrationResponse> {
    const requestId = this.createRequestId();

    this.requests.set(requestId, {
      requestId,
      message: request.message,
      context: {
        userId: request.userId,
        projectId: request.projectId,
        selectedModel: request.selectedModel,
        metadata: request.metadata,
      },
    });

    return this.execute(requestId);
  }

  async execute(requestId: string): Promise<OrchestrationResponse> {
    const stored = this.requests.get(requestId);

    if (!stored) {
      return {
        requestId,
        status: "failed",
        error: "Orchestration request not found.",
      };
    }

    const result = await this.orchestrator.handle(
      {
        taskId: stored.requestId,
        prompt: stored.message,
        projectId: stored.context.projectId,
        selectedModel: stored.context.selectedModel,
      },
      stored.context
    );

    return {
      requestId: stored.requestId,
      status: result.status,
      target: result.target,
      output: result.output,
      error: result.error,
      awaitingApproval: result.status === "awaiting_approval",
      approvalId: result.approvalId,
    };
  }

  private createRequestId(): string {
    return `orch_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
