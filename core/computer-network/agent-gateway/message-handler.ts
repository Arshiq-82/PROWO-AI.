import {
  AgentCommand,
  AgentEvent,
} from "../protocol/types";
import { AgentEventParser } from "../protocol/event-parser";
import {
  AgentGatewayEvent,
  AgentGatewaySession,
} from "./types";

export type AgentEventListener = (
  event: AgentGatewayEvent
) => Promise<void> | void;

export class AgentGatewayMessageHandler {
  private readonly listeners = new Set<AgentEventListener>();

  constructor(
    private readonly parser = new AgentEventParser()
  ) {}

  addListener(listener: AgentEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  parseEvent(
    session: AgentGatewaySession,
    raw: unknown
  ): AgentGatewayEvent {
    const event = this.parser.parse(raw);

    if (event.deviceId !== session.deviceId) {
      throw new Error(
        "Agent event device does not match session device."
      );
    }

    return {
      session,
      event,
    };
  }

  async handle(
    session: AgentGatewaySession,
    raw: unknown
  ): Promise<AgentGatewayEvent> {
    const gatewayEvent = this.parseEvent(session, raw);

    for (const listener of this.listeners) {
      await listener(gatewayEvent);
    }

    return gatewayEvent;
  }

  validateCommand(
    session: AgentGatewaySession,
    command: AgentCommand
  ): void {
    if (command.deviceId !== session.deviceId) {
      throw new Error(
        "Command device does not match session device."
      );
    }
  }
}
