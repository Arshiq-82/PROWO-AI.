import { ApiServerPort } from "./api-runtime";
import { BackendApplication } from "../bootstrap/types";
import { BackendApiRuntime } from "./api-runtime";

export interface CreateApiRuntimeDependencies {
  server: ApiServerPort;
  backend: BackendApplication;
}

export function createApiRuntime(
  dependencies: CreateApiRuntimeDependencies
): BackendApiRuntime {
  return new BackendApiRuntime(
    dependencies.server,
    dependencies.backend
  );
}
