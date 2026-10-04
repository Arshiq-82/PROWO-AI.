import { OrchestratorController } from "../orchestration/orchestration-controller";
import { OrchestrationRoutes } from "./orchestration-routes";
import { ApiRouteDefinition } from "./types";

export interface OrchestrationApi { routes: ApiRouteDefinition[]; }
export function createOrchestrationApi(controller: OrchestratorController): OrchestrationApi {
  return { routes: new OrchestrationRoutes(controller).definitions() };
}
