import {
  ApiClientResponse,
  ApiClientTransport,
} from "./api-client-types";

export interface OrchestrationClientRequest {
  message: string;
  projectId?: string;
  selectedModel?: string;
  metadata?: Record<string, unknown>;
}

export interface OrchestrationClientResponse {
  requestId: string;
  status: string;
  target?: string;
  output?: unknown;
  error?: string;
  awaitingApproval?: boolean;
  approvalId?: string;
}

export class OrchestrationClient {
  constructor(private readonly transport: ApiClientTransport) {}

  submit(
    request: OrchestrationClientRequest,
    token?: string
  ): Promise<ApiClientResponse<OrchestrationClientResponse>> {
    return this.transport.request({
      method: "POST",
      path: "/api/v1/orchestrations",
      body: request,
      token,
    });
  }

  execute(
    requestId: string,
    token?: string
  ): Promise<ApiClientResponse<OrchestrationClientResponse>> {
    return this.transport.request({
      method: "POST",
      path: `/api/v1/orchestrations/${encodeURIComponent(requestId)}/execute`,
      token,
    });
  }
}
