import {
  OrchestrationHttpRequest,
  OrchestrationHttpResponse,
} from "../orchestration/orchestration-controller";
import { ApiRouteDefinition, OrchestrationApiRoutes, ApiRouteContext } from "./orchestration-types";
import type { OrchestrationControllerPort } from "./orchestration-api";

export class OrchestrationRoutes implements OrchestrationApiRoutes {
  constructor(private readonly controller: OrchestrationControllerPort) {}

  submit(context: ApiRouteContext): Promise<OrchestrationHttpResponse> {
    return this.controller.submit(context.request);
  }

  execute(context: ApiRouteContext): Promise<OrchestrationHttpResponse> {
    return this.controller.execute(context.request);
  }

  definitions(): ApiRouteDefinition[] {
    return [
      { method: "POST", path: "/api/v1/orchestrations", handler: (context: ApiRouteContext) => this.submit(context) },
      { method: "POST", path: "/api/v1/orchestrations/:requestId/execute", handler: (context: ApiRouteContext) => this.execute(context) },
    ];
  }
}
