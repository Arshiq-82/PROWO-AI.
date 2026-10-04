import { OrchestratorController } from "../orchestrator-controller";
import { composeOrchestratorRuntime } from "./runtime-composer";
import { OrchestratorEngineDependencies } from "./types";

export interface ProwoOrchestrator {
  controller: OrchestratorController;
}

export function createProwoOrchestrator(
  dependencies: OrchestratorEngineDependencies
): ProwoOrchestrator {
  const bundle = composeOrchestratorRuntime(dependencies);

  return {
    controller: bundle.controller,
  };
}
