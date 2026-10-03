import {
  AgentCommand,
  AgentEvent,
} from "./types";
import { AgentCommandBuilder } from "./command-builder";
import { AgentEventParser } from "./event-parser";

export class AgentProtocol {
  readonly commands: AgentCommandBuilder;
  readonly events: AgentEventParser;

  constructor(
    commands = new AgentCommandBuilder(),
    events = new AgentEventParser()
  ) {
    this.commands = commands;
    this.events = events;
  }

  createCommand<T>(
    command: AgentCommand<T>
  ): AgentCommand<T> {
    return {
      ...command,
      timestamp: command.timestamp || new Date().toISOString(),
    };
  }

  parseEvent<T = unknown>(
    raw: unknown
  ): AgentEvent<T> {
    return this.events.parse<T>(raw);
  }
}
