export type TransportState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed"
  | "error";

export type TransportMessageType =
  | "agent.connected"
  | "agent.heartbeat"
  | "agent.disconnected"
  | "agent.task"
  | "agent.task.result"
  | "agent.event"
  | "server.command"
  | "server.ack"
  | "server.error";

export interface TransportMessage<T = unknown> {
  id: string;
  type: TransportMessageType;
  timestamp: string;
  agentId?: string;
  requestId?: string;
  payload?: T;
}

export interface TransportOptions {
  endpoint: string;
  reconnect?: boolean;
  reconnectDelayMs?: number;
  heartbeatIntervalMs?: number;
}

export interface TransportConnection {
  state: TransportState;
  connectedAt?: string;
  lastHeartbeatAt?: string;
  reconnectAttempts: number;
}

export interface TransportAdapter {
  connect(endpoint: string): Promise<void>;
  disconnect(): Promise<void>;
  send(message: TransportMessage): Promise<void>;
  onMessage(
    listener: (message: TransportMessage) => void
  ): () => void;
  onStateChange(
    listener: (state: TransportState) => void
  ): () => void;
}
