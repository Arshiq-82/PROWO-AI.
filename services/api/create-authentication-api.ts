import { OrchestratorController } from "../orchestration/orchestration-controller";
import { AuthenticatedRequestResolver } from "./authenticated-request";
import { AuthenticationAdapter, AuthServicePort } from "./authentication-adapter";
import { AuthenticatedOrchestrationController } from "./authenticated-orchestration-controller";

export interface AuthenticationApiDependencies {
  authService: AuthServicePort;
  orchestrationController: OrchestratorController;
}

export function createAuthenticatedOrchestrationController(
  dependencies: AuthenticationApiDependencies
): AuthenticatedOrchestrationController {
  const authentication = new AuthenticationAdapter(
    dependencies.authService
  );

  const resolver = new AuthenticatedRequestResolver(authentication);

  return new AuthenticatedOrchestrationController(
    resolver,
    dependencies.orchestrationController
  );
}
