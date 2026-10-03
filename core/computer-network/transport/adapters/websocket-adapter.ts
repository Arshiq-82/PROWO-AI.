import {
  TransportAdapter,
  TransportMessage,
  TransportState,
} from "../types";
import {
  WebSocketAdapterOptions,
  WebSocketLike,
} from "./types";
import { MessageCodec } from "../message-codec";

export class WebSocketTransportAdapter implements TransportAdapter {
  private socket?: WebSocketLike;
  private messageListeners = new Set<
    (message: TransportMessage) => void
  >();
  private stateListeners = new Set<
    (state: TransportState) => void
  >();

  constructor(
    private readonly options: WebSocketAdapterOptions,
    private readonly codec: MessageCodec = new MessageCodec()
  ) {}

  async connect(endpoint: string): Promise<void> {
    if (this.socket) {
      return;
    }

    const socket = this.options.factory.create(endpoint);
    this.socket = socket;

    socket.addEventListener("open", () => {
      this.emitState("connected");
    });

    socket.addEventListener("message", (event) => {
      const raw = this.extractMessageData(event);

      if (!raw) {
        return;
      }

      try {
        const message = this.codec.decode(raw);
        this.messageListeners.forEach((listener) =>
          listener(message)
        );
      } catch {
        this.emitState("error");
      }
    });

    socket.addEventListener("close", () => {
      this.socket = undefined;
      this.emitState("disconnected");
    });

    socket.addEventListener("error", () => {
      this.emitState("error");
    });
  }

  async disconnect(): Promise<void> {
    const socket = this.socket;
    this.socket = undefined;

    if (socket) {
      socket.close();
    }

    this.emitState("disconnected");
  }

  async send(message: TransportMessage): Promise<void> {
    if (!this.socket) {
      throw new Error("WebSocket is not connected.");
    }

    this.socket.send(this.codec.encode(message));
  }

  onMessage(
    listener: (message: TransportMessage) => void
  ): () => void {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onStateChange(
    listener: (state: TransportState) => void
  ): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  private emitState(state: TransportState): void {
    this.stateListeners.forEach((listener) => listener(state));
  }

  private extractMessageData(event: unknown): string | undefined {
    if (typeof event === "string") {
      return event;
    }

    if (
      event &&
      typeof event === "object" &&
      "data" in event
    ) {
      const data = (event as { data?: unknown }).data;

      return typeof data === "string" ? data : undefined;
    }

    return undefined;
  }
}
