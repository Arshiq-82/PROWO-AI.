import { OrchestrationClient } from "./orchestration-client";
import { ProwoApiClient } from "./api-client";

export interface FrontendRuntime {
  orchestration: OrchestrationClient;
}

export function createFrontendRuntime(
  baseUrl: string
): FrontendRuntime {
  const api = new ProwoApiClient(baseUrl);

  return {
    orchestration: new OrchestrationClient(api),
  };
}
