import { BackendApplication } from "./types";
import { AuthServicePort } from "../api/authentication-adapter";
import { OrchestrationDatabasePort } from "../orchestration/database-orchestration-repository";
import { OrchestratorController } from "../orchestration/orchestration-controller";

export interface ProductionDependencies {
  database: OrchestrationDatabasePort;
  authService: AuthServicePort;
  orchestratorController: OrchestratorController;
}

export interface ProductionApplication extends BackendApplication {
  environment: "development" | "test" | "production";
}
