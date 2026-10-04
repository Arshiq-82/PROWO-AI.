import { OrchestrationHttpRequest, OrchestrationHttpResponse } from "../orchestration/orchestration-controller";

export interface ApiRouteContext { request: OrchestrationHttpRequest; }
export interface OrchestrationApiRoutes {
  submit(context: ApiRouteContext): Promise<OrchestrationHttpResponse>;
  execute(context: ApiRouteContext): Promise<OrchestrationHttpResponse>;
}
export interface ApiRouteDefinition {
  method: "POST";
  path: string;
  handler: (context: ApiRouteContext) => Promise<OrchestrationHttpResponse>;
}
