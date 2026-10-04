export interface ProwoRuntimeConfig {
  environment: "development" | "test" | "production";
  version: string;
  apiPrefix: string;
}

export function createRuntimeConfig(
  environment: ProwoRuntimeConfig["environment"] = "development"
): ProwoRuntimeConfig {
  return {
    environment,
    version: "0.1.0",
    apiPrefix: "/api/v1",
  };
}
