import { ApiRequest, ApiResponse } from "./types";
import { ApiRouteRegistry } from "./route-registry";
import { createOrchestrationApi, OrchestrationControllerPort } from "./orchestration-api";

export function registerOrchestrationRoutes(
  registry: ApiRouteRegistry,
  controller: OrchestrationControllerPort
): void {
  for (const route of createOrchestrationApi(controller).routes) {
    registry.register(
      route.method,
      route.path,
      async (request: ApiRequest): Promise<ApiResponse> => {
        const response = await route.handler({
          request: {
            body: request.body as Record<string, unknown> | undefined,
            params: { requestId: request.requestId },
          },
        });
        return {
          status: response.statusCode,
          headers: { "content-type": "application/json" },
          body: response.body,
        };
      }
    );
  }
}
