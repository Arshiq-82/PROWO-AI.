import {
  TransportAdapter,
  TransportConnection,
  TransportMessage,
  TransportOptions,
  TransportState,
} from "./types";
import { MessageCodec } from "./message-codec";

export class AgentTransport {
  private state: TransportConnection = {
    state: "disconnected",
    reconnectAttempts: 0,
  };

  private heartbeatTimer?: ReturnType<typeof setInterval>;
  private reconnectTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly adapter: TransportAdapter,
    private readonly options: TransportOptions,
    private readonly codec: MessageCodec = new MessageCodec()
  ) {}

  getConnection(): TransportConnection {
    return { ...this.state };
  }

  async connect(): Promise<void> {
    if (
      this.state.state === "connecting" ||
      this.state.state === "connected"
    ) {
      return;
    }

    this.setState("connecting");

    try {
      await this.adapter.connect(this.options.endpoint);

      this.state = {
        ...this.state,
        state: "connected",
        connectedAt: new Date().toISOString(),
        reconnectAttempts: 0,
      };

      this.startHeartbeat();
      this.emitState("connected");
    } catch (error) {
      this.setState("error");

      if (this.options.reconnect !== false) {
        this.scheduleReconnect();
      }

      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.stopHeartbeat();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }

    await this.adapter.disconnect();

    this.state = {
      ...this.state,
      state: "closed",
    };

    this.emitState("closed");
  }

  async send(message: TransportMessage): Promise<void> {
    if (this.state.state !== "connected") {
      throw new Error("Transport is not connected.");
    }

    await this.adapter.send(message);
  }

  onMessage(
    listener: (message: TransportMessage) => void
  ): () => void {
    return this.adapter.onMessage(listener);
  }

  onStateChange(
    listener: (state: TransportState) => void
  ): () => void {
    return this.adapter.onStateChange(listener);
  }

  encode(message: TransportMessage): string {
    return this.codec.encode(message);
  }

  decode(raw: string): TransportMessage {
    return this.codec.decode(raw);
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    const interval =
      this.options.heartbeatIntervalMs ?? 30_000;

    this.heartbeatTimer = setInterval(() => {
      this.state.lastHeartbeatAt = new Date().toISOString();
    }, interval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = undefined;
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      return;
    }

    this.state.reconnectAttempts += 1;
    this.setState("reconnecting");

    const baseDelay =
      this.options.reconnectDelayMs ?? 2_000;

    const delay = Math.min(
      baseDelay * 2 ** (this.state.reconnectAttempts - 1),
      30_000
    );

    this.reconnectTimer = setTimeout(async () => {
      this.reconnectTimer = undefined;

      try {
        await this.connect();
      } catch {
        if (this.options.reconnect !== false) {
          this.scheduleReconnect();
        }
      }
    }, delay);
  }

  private setState(state: TransportState): void {
    this.state.state = state;
    this.emitState(state);
  }

  private emitState(state: TransportState): void {
    // State listeners are owned by the adapter.
    // Concrete adapters can bridge this event to the application.
    void state;
  }
}
