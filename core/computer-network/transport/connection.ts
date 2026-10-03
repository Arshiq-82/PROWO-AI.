import {
  TransportAdapter,
  TransportConnection,
  TransportMessage,
  TransportOptions,
  TransportState,
} from "./types";
import { AgentTransport } from "./transport";

export class AgentConnection {
  readonly transport: AgentTransport;

  constructor(
    adapter: TransportAdapter,
    options: TransportOptions
  ) {
    this.transport = new AgentTransport(
      adapter,
      options
    );
  }

  get state(): TransportConnection {
    return this.transport.getConnection();
  }

  async open(): Promise<void> {
    await this.transport.connect();
  }

  async close(): Promise<void> {
    await this.transport.disconnect();
  }

  async send<T>(
    type: TransportMessage["type"],
    payload: T,
    agentId?: string,
    requestId?: string
  ): Promise<void> {
    const message: TransportMessage<T> = {
      id: this.createMessageId(),
      type,
      timestamp: new Date().toISOString(),
      agentId,
      requestId,
      payload,
    };

    await this.transport.send(message);
  }

  onMessage(
    listener: (message: TransportMessage) => void
  ): () => void {
    return this.transport.onMessage(listener);
  }

  private createMessageId(): string {
    return `msg_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
