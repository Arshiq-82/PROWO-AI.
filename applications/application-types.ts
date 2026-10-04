import { BackendApplication } from "../services/bootstrap/types";

export interface ProwoApplication extends BackendApplication {
  name: "prowo";
  version: string;
}
