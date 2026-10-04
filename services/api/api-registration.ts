import { ApiRouteRegistry } from "./route-registry";
import { createOrchestrationApi } from "./orchestration-api";
import { OrchestratorController } from "../orchestration/orchestration-controller";

export function registerOrchestrationRoutes(registry: ApiRouteRegistry, controller: OrchestratorController): void {
  for (const route of createOrchestrationApi(controller).routes) registry.register(route.method, route.path, route.handler);
}
