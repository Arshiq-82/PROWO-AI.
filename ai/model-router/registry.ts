import { ProwoModelRouter } from "./router";
import { MockAIAdapter } from "./mock-adapter";

/**
 * Creates the central model router.
 *
 * Provider-specific production adapters are registered separately.
 * Keeping registration in one place allows the orchestrator to remain
 * independent of provider SDKs and credentials.
 */
export function createModelRouter(): ProwoModelRouter {
  const router = new ProwoModelRouter();

  // Safe local adapter for development and automated tests.
  router.register(new MockAIAdapter());

  return router;
}
