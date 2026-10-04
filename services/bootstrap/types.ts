import { OrchestrationController } from "../orchestration/orchestration-controller";
import { OrchestrationDatabasePort } from "../orchestration/database-orchestration-repository";
import { AuthServicePort } from "../api/authentication-adapter";
import { ApiRouteRegistry } from "./../api/route-registry";

export interface BackendDependencies {
  database: OrchestrationDatabasePort;
  authService: AuthServicePort;
  orchestratorController: OrchestrationController;
}

export interface BackendApplication {
  apiRegistry: ApiRouteRegistry;
  start(): Promise<void>;
  stop(): Promise<void>;
}
