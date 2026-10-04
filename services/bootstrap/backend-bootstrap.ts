import { BackendApplication, BackendDependencies } from "./types";
import { createBackendApplication } from "./backend-composition";

export interface BackendBootstrap {
  create(): BackendApplication;
}

export class ProwoBackendBootstrap implements BackendBootstrap {
  constructor(private readonly dependencies: BackendDependencies) {}

  create(): BackendApplication {
    return createBackendApplication(this.dependencies);
  }
}

export function createProwoBackend(
  dependencies: BackendDependencies
): BackendApplication {
  return new ProwoBackendBootstrap(dependencies).create();
}
