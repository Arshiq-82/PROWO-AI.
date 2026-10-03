import {
  AgentCommand,
  AgentEvent,
} from "../protocol/types";
import { DeviceManager } from "../device-manager";
import {
  AgentGatewayOptions,
  AgentGatewaySession,
  AgentGatewayTransport,
} from "./types";
import {
  ConnectionSessionManager,
} from "./connection-session";
import {
  AgentGatewayMessageHandler,
  AgentEventListener,
} from "./message-handler";

export class AgentGateway {
  private readonly sessions =
    new ConnectionSessionManager();

  private readonly messages =
    new AgentGatewayMessageHandler();

  private readonly options: AgentGatewayOptions;

  constructor(
    private readonly transport: AgentGatewayTransport,
    private readonly devices: DeviceManager,
    options: AgentGatewayOptions = {}
  ) {
    this.options = {
      heartbeatTimeoutMs: 90_000,
      maxSessionsPerDevice: 2,
      ...options,
    };
  }

  connect(
    sessionId: string,
    deviceId: string,
    metadata?: Record<string, unknown>
  ): AgentGatewaySession {
    const existing = this.sessions.forDevice(deviceId);

    if (
      existing.length >=
      (this.options.maxSessionsPerDevice ?? 2)
    ) {
      throw new Error(
        `Maximum sessions reached for device "${deviceId}".`
      );
    }

    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(
        `Device "${deviceId}" is not registered.`
      );
    }

    const session = this.sessions.create(
      sessionId,
      deviceId,
      metadata
    );

    this.devices.updateStatus(deviceId, "online");
    return session;
  }

  async disconnect(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }

    this.sessions.setState(
      sessionId,
      "closing"
    );

    await this.transport.close(sessionId);
    this.sessions.remove(sessionId);

    const remaining =
      this.sessions.forDevice(session.deviceId);

    if (remaining.length === 0) {
      this.devices.updateStatus(
        session.deviceId,
        "offline"
      );
    }
  }

  async send(
    sessionId: string,
    command: AgentCommand
  ): Promise<void> {
    const session = this.requireSession(sessionId);

    this.messages.validateCommand(session, command);
    this.sessions.touch(sessionId);

    await this.transport.send(
      sessionId,
      command
    );
  }

  async handleMessage(
    sessionId: string,
    raw: unknown
  ): Promise<AgentEvent> {
    const session = this.requireSession(sessionId);

    this.sessions.touch(sessionId);

    const gatewayEvent =
      await this.messages.handle(
        session,
        raw
      );

    if (
      gatewayEvent.event.type === "device_status"
    ) {
      this.devices.updateStatus(
        session.deviceId,
        "online"
      );
    }

    return gatewayEvent.event;
  }

  addEventListener(
    listener: AgentEventListener
  ): () => void {
    return this.messages.addListener(listener);
  }

  listSessions(): AgentGatewaySession[] {
    return this.sessions.list();
  }

  getSession(
    sessionId: string
  ): AgentGatewaySession | undefined {
    return this.sessions.get(sessionId);
  }

  private requireSession(
    sessionId: string
  ): AgentGatewaySession {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(
        `Gateway session "${sessionId}" not found.`
      );
    }

    return session;
  }
}
