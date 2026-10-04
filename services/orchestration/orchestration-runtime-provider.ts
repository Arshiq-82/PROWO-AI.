import { OrchestratorRuntimePort } from "./types";

export interface OrchestrationRuntimeProvider {
  getOrchestrator(): OrchestratorRuntimePort;
}

export class StaticOrchestrationRuntimeProvider
  implements OrchestrationRuntimeProvider
{
  constructor(private readonly orchestrator: OrchestratorRuntimePort) {}

  getOrchestrator(): OrchestratorRuntimePort {
    return this.orchestrator;
  }
}
