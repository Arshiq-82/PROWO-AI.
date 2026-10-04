import { OrchestrationController } from "./orchestration-controller";
import { OrchestratorRuntimePort } from "./types";

export interface CreateOrchestrationServiceDependencies {
  orchestrator: OrchestratorRuntimePort;
}

export function createOrchestrationService(
  dependencies: CreateOrchestrationServiceDependencies
): OrchestrationController {
  return new OrchestrationController({
    orchestrator: dependencies.orchestrator,
  });
}
