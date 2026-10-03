import { AgentCommand, AgentEvent } from "../protocol/types";
import { AgentExecutionResult } from "../agent-executor/types";

export type AgentGatewaySessionState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "closing";

export interface AgentGatewaySession {
  sessionId: string;
  deviceId: string;
  state: AgentGatewaySessionState;
  connectedAt: string;
  lastSeenAt: string;
  metadata?: Record<string, unknown>;
}

export interface GatewayCommandResult {
  command: AgentCommand;
  result: AgentExecutionResult;
}

export interface AgentGatewayEvent {
  session: AgentGatewaySession;
  event: AgentEvent;
}

export interface AgentGatewayTransport {
  send(
    sessionId: string,
    message: AgentCommand | AgentEvent
  ): Promise<void>;
  close(sessionId: string): Promise<void>;
}

export interface AgentGatewayOptions {
  heartbeatTimeoutMs?: number;
  maxSessionsPerDevice?: number;
}
