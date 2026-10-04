export interface ApplicationHealth {
  status: "ready" | "stopped";
  version: string;
  timestamp: string;
}

export function getApplicationHealth(
  version: string,
  ready: boolean
): ApplicationHealth {
  return {
    status: ready ? "ready" : "stopped",
    version,
    timestamp: new Date().toISOString(),
  };
}
