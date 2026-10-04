import {
  OrchestrationContext,
  OrchestrationResponse,
  OrchestrationServicePort,
  OrchestrationSubmitRequest,
  OrchestratorRuntimePort,
} from "./types";
import {
  InMemoryOrchestrationRepository,
} from "./in-memory-orchestration-repository";
import {
  OrchestrationRecord,
  OrchestrationRecordRepository,
} from "./orchestration-record-types";

export interface PersistentOrchestrationServiceDependencies {
  orchestrator: OrchestratorRuntimePort;
  repository?: OrchestrationRecordRepository;
}

export class PersistentOrchestrationService
  implements OrchestrationServicePort
{
  private readonly repository: OrchestrationRecordRepository;

  constructor(
    private readonly orchestrator: OrchestratorRuntimePort,
    repository?: OrchestrationRecordRepository
  ) {
    this.repository =
      repository ?? new InMemoryOrchestrationRepository();
  }

  async submit(
    request: OrchestrationSubmitRequest
  ): Promise<OrchestrationResponse> {
    const requestId = this.createRequestId();
    const now = new Date().toISOString();

    const record: OrchestrationRecord = {
      requestId,
      userId: request.userId,
      projectId: request.projectId,
      message: request.message,
      selectedModel: request.selectedModel,
      status: "submitted",
      metadata: request.metadata,
      createdAt: now,
      updatedAt: now,
    };

    await this.repository.create(record);

    return this.execute(requestId);
  }

  async execute(requestId: string): Promise<OrchestrationResponse> {
    const stored = await this.repository.get(requestId);

    if (!stored) {
      return {
        requestId,
        status: "failed",
        error: "Orchestration request not found.",
      };
    }

    await this.repository.update(requestId, {
      status: "planning",
    });

    const context: OrchestrationContext = {
      userId: stored.userId,
      projectId: stored.projectId,
      selectedModel: stored.selectedModel,
      metadata: stored.metadata,
    };

    try {
      const result = await this.orchestrator.handle(
        {
          taskId: stored.requestId,
          userId: stored.userId,
          prompt: stored.message,
          projectId: stored.projectId,
          selectedModel: stored.selectedModel,
        },
        context
      );

      await this.repository.update(requestId, {
        status: this.toRecordStatus(result.status),
        target: result.target,
        output: result.output,
        error: result.error,
        approvalId: result.approvalId,
      });

      return {
        requestId: stored.requestId,
        status: result.status,
        target: result.target,
        output: result.output,
        error: result.error,
        awaitingApproval: result.status === "awaiting_approval",
        approvalId: result.approvalId,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Orchestration failed.";

      await this.repository.update(requestId, {
        status: "failed",
        error: message,
      });

      return {
        requestId,
        status: "failed",
        error: message,
      };
    }
  }

  private toRecordStatus(status: string): OrchestrationRecord["status"] {
    switch (status) {
      case "awaiting_approval":
        return "awaiting_approval";
      case "queued":
        return "queued";
      case "running":
        return "running";
      case "completed":
        return "completed";
      case "failed":
        return "failed";
      case "planning":
        return "planning";
      default:
        return "submitted";
    }
  }

  private createRequestId(): string {
    return `orch_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}
