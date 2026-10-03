import {
  TransportMessage,
  TransportState,
} from "../types";
import {
  WebSocketServerAdapter,
  WebSocketServerClient,
  WebSocketServerOptions,
} from "./types";
import { MessageCodec } from "../message-codec";

export class ProwoWebSocketServer
  implements WebSocketServerAdapter
{
  private readonly clients = new Map<
    string,
    WebSocketServerClient
  >();

  constructor(
    private readonly options: WebSocketServerOptions = {},
    private readonly codec: MessageCodec = new MessageCodec()
  ) {}

  addClient(client: WebSocketServerClient): void {
    const maxConnections =
      this.options.maxConnections ?? 1000;

    if (
      !this.clients.has(client.id) &&
      this.clients.size >= maxConnections
    ) {
      throw new Error("WebSocket connection limit reached.");
    }

    this.clients.set(client.id, client);

    client.socket.addEventListener("message", (event) => {
      void event;
    });

    client.socket.addEventListener("close", () => {
      this.removeClient(client.id);
    });

    client.state = "connected";
  }

  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);

    if (!client) {
      return;
    }

    client.state = "disconnected";
    this.clients.delete(clientId);
  }

  getClient(clientId: string): WebSocketServerClient | undefined {
    return this.clients.get(clientId);
  }

  listClients(): WebSocketServerClient[] {
    return [...this.clients.values()];
  }

  broadcast(message: TransportMessage): void {
    const encoded = this.codec.encode(message);

    for (const client of this.clients.values()) {
      if (client.state !== "connected") {
        continue;
      }

      client.socket.send(encoded);
    }
  }

  sendToClient(
    clientId: string,
    message: TransportMessage
  ): void {
    const client = this.clients.get(clientId);

    if (!client) {
      throw new Error(`Client "${clientId}" not found.`);
    }

    if (client.state !== "connected") {
      throw new Error(`Client "${clientId}" is not connected.`);
    }

    client.socket.send(this.codec.encode(message));
  }
}
