import { OrchestratorController } from "./orchestration-controller";
import { OrchestratorRuntimePort } from "./types";

export interface CreateOrchestrationServiceDependencies {
  orchestrator: OrchestratorRuntimePort;
}

export function createOrchestrationService(
  dependencies: CreateOrchestrationServiceDependencies
): OrchestratorController {
  return new OrchestratorController({
    orchestrator: dependencies.orchestrator,
  });
}
