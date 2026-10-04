import {
  OrchestratorRuntimePort,
} from "./types";
import {
  OrchestrationDatabasePort,
  DatabaseOrchestrationRepository,
} from "./database-orchestration-repository";
import { PersistentOrchestrationService } from "./persistent-orchestration-service";

export interface PersistentOrchestrationDependencies {
  orchestrator: OrchestratorRuntimePort;
  database: OrchestrationDatabasePort;
}

export function createPersistentOrchestrationService(
  dependencies: PersistentOrchestrationDependencies
): PersistentOrchestrationService {
  const repository = new DatabaseOrchestrationRepository(
    dependencies.database
  );

  return new PersistentOrchestrationService(
    dependencies.orchestrator,
    repository
  );
}
