import { BackendApplication } from "./types";
import { AuthServicePort } from "../api/authentication-adapter";
import { OrchestrationDatabasePort } from "../orchestration/database-orchestration-repository";
import { OrchestrationController } from "../orchestration/orchestration-controller";

export interface ProductionDependencies {
  database: OrchestrationDatabasePort;
  authService: AuthServicePort;
  orchestratorController: OrchestrationController;
}

export interface ProductionApplication extends BackendApplication {
  environment: "development" | "test" | "production";
}
