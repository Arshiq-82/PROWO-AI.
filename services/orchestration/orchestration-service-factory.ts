import {
  OrchestrationRuntimeProvider,
} from "./orchestration-runtime-provider";
import { OrchestrationDatabasePort } from "./database-orchestration-repository";
import { PersistentOrchestrationService } from "./persistent-orchestration-service";
import { createPersistentOrchestrationService } from "./create-persistent-orchestration-service";

export interface OrchestrationServiceFactoryDependencies {
  runtime: OrchestrationRuntimeProvider;
  database: OrchestrationDatabasePort;
}

export function createProductionOrchestrationService(
  dependencies: OrchestrationServiceFactoryDependencies
): PersistentOrchestrationService {
  return createPersistentOrchestrationService({
    orchestrator: dependencies.runtime.getOrchestrator(),
    database: dependencies.database,
  });
}
