import { OrchestrationController, OrchestrationHttpRequest, OrchestrationHttpResponse } from "../orchestration/orchestration-controller";
import { ApiRouteDefinition, OrchestrationApiRoutes } from "./types";

export class OrchestrationRoutes implements OrchestrationApiRoutes {
  constructor(private readonly controller: OrchestrationController) {}
  submit(context: { request: OrchestrationHttpRequest }): Promise<OrchestrationHttpResponse> { return this.controller.submit(context.request); }
  execute(context: { request: OrchestrationHttpRequest }): Promise<OrchestrationHttpResponse> { return this.controller.execute(context.request); }
  definitions(): ApiRouteDefinition[] {
    return [
      { method: "POST", path: "/api/v1/orchestrations", handler: (context) => this.submit(context) },
      { method: "POST", path: "/api/v1/orchestrations/:requestId/execute", handler: (context) => this.execute(context) },
    ];
  }
}
