import { AgentConfig } from "./agent-config";
import { AgentHealth } from "./agent-health";
import { AgentTransportBridge } from "./agent-transport";
import { AgentTaskExecutor } from "./agent-task-executor";

export interface AgentApplication {
  config: AgentConfig;
  health: AgentHealth;
  transport: AgentTransportBridge;
  executor: AgentTaskExecutor;
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface AgentBootstrapDependencies {
  config: AgentConfig;
  transport: AgentTransportBridge;
  executor: AgentTaskExecutor;
}

export function createAgentApplication(
  dependencies: AgentBootstrapDependencies
): AgentApplication {
  const health = new AgentHealth(dependencies.config.deviceId);
  let started = false;

  return {
    config: dependencies.config,
    health,
    transport: dependencies.transport,
    executor: dependencies.executor,

    async start(): Promise<void> {
      if (started) return;

      health.markHealthy();
      await dependencies.transport.connect();
      started = true;
    },

    async stop(): Promise<void> {
      if (!started) return;

      await dependencies.transport.disconnect();
      health.markOffline();
      started = false;
    },
  };
}
