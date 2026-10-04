import { OrchestratorRequest, OrchestratorResult } from "../../core/orchestrator/runtime-types";

export interface OrchestrationSubmitRequest {
  userId: string;
  message: string;
  projectId?: string;
  selectedModel?: string;
  metadata?: Record<string, unknown>;
}

export interface OrchestrationContext {
  userId: string;
  projectId?: string;
  selectedModel?: string;
  metadata?: Record<string, unknown>;
}

export interface OrchestrationResponse {
  requestId: string;
  status: string;
  target?: string;
  output?: unknown;
  error?: string;
  awaitingApproval?: boolean;
  approvalId?: string;
}

export interface OrchestratorRuntimePort {
  handle(
    request: OrchestratorRequest,
    context?: OrchestrationContext
  ): Promise<OrchestratorResult>;
}

export interface OrchestrationServicePort {
  submit(request: OrchestrationSubmitRequest): Promise<OrchestrationResponse>;
  execute(requestId: string): Promise<OrchestrationResponse>;
}
