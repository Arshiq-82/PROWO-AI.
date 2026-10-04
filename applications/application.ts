import { ProwoApplication } from "./application-types";
import { BackendApplication } from "../services/bootstrap/types";

export function createProwoApplication(
  backend: BackendApplication,
  version = "0.1.0"
): ProwoApplication {
  return {
    name: "prowo",
    version,
    apiRegistry: backend.apiRegistry,
    start: () => backend.start(),
    stop: () => backend.stop(),
  };
}
