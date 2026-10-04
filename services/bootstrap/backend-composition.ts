import { registerOrchestrationRoutes } from "../api/api-registration";
import { ApiRouteRegistry } from "../api/route-registry";
import { createAuthenticatedOrchestrationController } from "../api/create-authentication-api";
import { BackendApplication, BackendDependencies } from "./types";

export function createBackendApplication(
  dependencies: BackendDependencies
): BackendApplication {
  const apiRegistry = new ApiRouteRegistry();

  /*
   * Authentication-aware orchestration is composed here so the HTTP
   * boundary never needs to construct authentication or orchestration
   * dependencies itself.
   */
  const authenticatedController =
    createAuthenticatedOrchestrationController({
      authService: dependencies.authService,
      orchestrationController: dependencies.orchestratorController,
    });

  registerOrchestrationRoutes(
    apiRegistry,
    authenticatedController as never
  );

  let started = false;

  return {
    apiRegistry,

    async start(): Promise<void> {
      if (started) return;
      started = true;
    },

    async stop(): Promise<void> {
      if (!started) return;
      started = false;
    },
  };
}
