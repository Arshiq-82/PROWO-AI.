import { createFrontendRuntime, FrontendRuntime } from "./frontend-runtime";
import { OrchestrationStateManager } from "./orchestration-state";

export interface ProwoWebRuntime {
  orchestration: OrchestrationStateManager;
}

export function createProwoWebRuntime(baseUrl: string): ProwoWebRuntime {
  const runtime: FrontendRuntime = createFrontendRuntime(baseUrl);

  return {
    orchestration: new OrchestrationStateManager(runtime.orchestration),
  };
}
