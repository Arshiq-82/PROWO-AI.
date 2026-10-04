import {
  OrchestrationManager,
  OrchestrationManagerDependencies,
} from "./orchestration-manager";
import {
  OrchestrationSubmitRequest,
  OrchestrationResponse,
} from "./types";

export interface OrchestrationHttpRequest {
  body?: Partial<OrchestrationSubmitRequest>;
  params?: {
    requestId?: string;
  };
}

export interface OrchestrationHttpResponse {
  statusCode: number;
  body: unknown;
}

export class OrchestrationController {
  private readonly manager: OrchestrationManager;

  constructor(dependencies: OrchestrationManagerDependencies) {
    this.manager = new OrchestrationManager(dependencies);
  }

  async submit(
    request: OrchestrationHttpRequest
  ): Promise<OrchestrationHttpResponse> {
    const body = request.body;

    if (!body?.userId || !body.message) {
      return {
        statusCode: 400,
        body: {
          error: "userId and message are required.",
        },
      };
    }

    const result = await this.manager.submit({
      userId: body.userId,
      message: body.message,
      projectId: body.projectId,
      selectedModel: body.selectedModel,
      metadata: body.metadata,
    });

    return this.toHttpResponse(result);
  }

  async execute(
    request: OrchestrationHttpRequest
  ): Promise<OrchestrationHttpResponse> {
    if (!request.params?.requestId) {
      return {
        statusCode: 400,
        body: {
          error: "requestId is required.",
        },
      };
    }

    const result = await this.manager.execute(request.params.requestId);
    return this.toHttpResponse(result);
  }

  private toHttpResponse(
    result: OrchestrationResponse
  ): OrchestrationHttpResponse {
    const statusCode =
      result.status === "failed"
        ? 500
        : result.status === "awaiting_approval"
          ? 202
          : 200;

    return {
      statusCode,
      body: result,
    };
  }
}
