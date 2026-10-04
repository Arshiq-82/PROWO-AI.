import { BackendApplication } from "../services/bootstrap/types";
import { ProwoApplication } from "./application-types";
import { createProwoApplication } from "./application";

export function bootstrapProwo(
  backend: BackendApplication,
  version = "0.1.0"
): ProwoApplication {
  return createProwoApplication(backend, version);
}
