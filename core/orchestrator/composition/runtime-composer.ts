import {
  createOrchestratorRuntime,
  OrchestratorRuntimeBundle,
} from "../orchestrator-runtime-factory";
import { registerEngineExecutors } from "./executor-factory";
import { OrchestratorEngineDependencies } from "./types";

export function composeOrchestratorRuntime(
  dependencies: OrchestratorEngineDependencies
): OrchestratorRuntimeBundle {
  return createOrchestratorRuntime(
    dependencies.approvals,
    (registry) => registerEngineExecutors(registry, dependencies)
  );
}
