export type AgentTransportState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "closed"
  | "error";

export interface AgentTransportMessage {
  type: string;
  requestId?: string;
  payload?: unknown;
}

export interface AgentTransportPort {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(message: AgentTransportMessage): Promise<void>;
  onMessage(handler: (message: AgentTransportMessage) => void): void;
  state(): AgentTransportState;
}

/**
 * Thin transport boundary for the existing Agent SDK.
 * The concrete WebSocket implementation stays in core/computer-network.
 */
export class AgentTransportBridge {
  constructor(private readonly transport: AgentTransportPort) {}

  connect(): Promise<void> {
    return this.transport.connect();
  }

  disconnect(): Promise<void> {
    return this.transport.disconnect();
  }

  send(message: AgentTransportMessage): Promise<void> {
    return this.transport.send(message);
  }

  onMessage(
    handler: (message: AgentTransportMessage) => void
  ): void {
    this.transport.onMessage(handler);
  }

  state(): AgentTransportState {
    return this.transport.state();
  }
}
