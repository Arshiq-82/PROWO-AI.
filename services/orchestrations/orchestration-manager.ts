import {
  OrchestrationResponse,
  OrchestrationSubmitRequest,
  OrchestratorRuntimePort,
} from "./types";
import { OrchestrationService } from "./orchestration-service";

export interface OrchestrationManagerDependencies {
  orchestrator: OrchestratorRuntimePort;
}

export class OrchestrationManager {
  private readonly service: OrchestrationService;

  constructor(dependencies: OrchestrationManagerDependencies) {
    this.service = new OrchestrationService(dependencies.orchestrator);
  }

  submit(
    request: OrchestrationSubmitRequest
  ): Promise<OrchestrationResponse> {
    return this.service.submit(request);
  }

  execute(requestId: string): Promise<OrchestrationResponse> {
    return this.service.execute(requestId);
  }
}
