import { createBackendApplication } from "./backend-composition";
import { ProductionApplication, ProductionDependencies } from "./production-types";

export function createProductionApplication(
  dependencies: ProductionDependencies,
  environment: ProductionApplication["environment"] = "production"
): ProductionApplication {
  const backend = createBackendApplication(dependencies);

  return {
    environment,
    apiRegistry: backend.apiRegistry,
    start: () => backend.start(),
    stop: () => backend.stop(),
  };
}
