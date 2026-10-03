import { TransportAdapter, TransportMessage, TransportState } from "../types";

export interface WebSocketLike {
  send(data: string): void;
  close(): void;
  addEventListener(
    type: "open" | "message" | "close" | "error",
    listener: (event: unknown) => void
  ): void;
}

export interface WebSocketFactory {
  create(endpoint: string): WebSocketLike;
}

export interface WebSocketAdapterOptions {
  factory: WebSocketFactory;
  reconnect?: boolean;
}

export interface WebSocketServerClient {
  id: string;
  deviceId?: string;
  state: TransportState;
  socket: WebSocketLike;
}

export interface WebSocketServerOptions {
  path?: string;
  maxConnections?: number;
}

export interface WebSocketServerAdapter {
  addClient(client: WebSocketServerClient): void;
  removeClient(clientId: string): void;
  getClient(clientId: string): WebSocketServerClient | undefined;
  listClients(): WebSocketServerClient[];
  broadcast(message: TransportMessage): void;
  sendToClient(clientId: string, message: TransportMessage): void;
}
