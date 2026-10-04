export interface AgentConfig {
  deviceId: string;
  agentName: string;
  serverUrl: string;
  registrationToken?: string;
  heartbeatIntervalMs: number;
  reconnect: boolean;
  maxReconnectAttempts: number;
}

export function createAgentConfig(
  deviceId: string,
  serverUrl: string,
  overrides: Partial<AgentConfig> = {}
): AgentConfig {
  return {
    deviceId,
    agentName: overrides.agentName ?? `Prowo Agent ${deviceId}`,
    serverUrl,
    registrationToken: overrides.registrationToken,
    heartbeatIntervalMs: overrides.heartbeatIntervalMs ?? 15_000,
    reconnect: overrides.reconnect ?? true,
    maxReconnectAttempts: overrides.maxReconnectAttempts ?? 10,
  };
}
