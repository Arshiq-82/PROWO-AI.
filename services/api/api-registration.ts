import { ApiRouteRegistry } from "./route-registry";
import { createOrchestrationApi } from "./orchestration-api";
import {
  OrchestrationController,
  OrchestrationHttpRequest,
  OrchestrationHttpResponse,
} from "../orchestration/orchestration-controller";

export interface OrchestrationControllerPort {
  submit(
    request: OrchestrationHttpRequest
  ): Promise<OrchestrationHttpResponse>;

  execute(
    request: OrchestrationHttpRequest
  ): Promise<OrchestrationHttpResponse>;
}

export function registerOrchestrationRoutes(
  registry: ApiRouteRegistry,
  controller: OrchestrationControllerPort
): void {
  for (const route of createOrchestrationApi(controller).routes) registry.register(route.method, route.path, route.handler);
}
