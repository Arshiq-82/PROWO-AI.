import { OrchestrationController } from "../orchestration/orchestration-controller";
import { OrchestrationRoutes } from "./orchestration-routes";
import { ApiRouteDefinition } from "./orchestration-types";

export interface OrchestrationControllerPort {
  submit(request: Parameters<OrchestrationController["submit"]>[0]): ReturnType<OrchestrationController["submit"]>;
  execute(request: Parameters<OrchestrationController["execute"]>[0]): ReturnType<OrchestrationController["execute"]>;
}

export interface OrchestrationApi {
  routes: ApiRouteDefinition[];
}

export function createOrchestrationApi(
  controller: OrchestrationControllerPort
): OrchestrationApi {
  return { routes: new OrchestrationRoutes(controller).definitions() };
}
