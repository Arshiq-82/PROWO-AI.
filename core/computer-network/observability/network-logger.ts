import { randomUUID } from "node:crypto";
import { NetworkLogEntry, NetworkLogLevel } from "./types";

export class NetworkLogger {
  private readonly entries: NetworkLogEntry[] = [];

  log(
    level: NetworkLogLevel,
    event: string,
    message: string,
    options: {
      deviceId?: string;
      taskId?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ): NetworkLogEntry {
    const entry: NetworkLogEntry = {
      id: randomUUID(),
      timestamp: new Date().toISOString(),
      level,
      event,
      message,
      deviceId: options.deviceId,
      taskId: options.taskId,
      metadata: options.metadata,
    };

    this.entries.push(entry);
    return { ...entry };
  }

  debug(event: string, message: string, options = {}) {
    return this.log("debug", event, message, options);
  }

  info(event: string, message: string, options = {}) {
    return this.log("info", event, message, options);
  }

  warn(event: string, message: string, options = {}) {
    return this.log("warn", event, message, options);
  }

  error(event: string, message: string, options = {}) {
    return this.log("error", event, message, options);
  }

  list(filters?: {
    level?: NetworkLogLevel;
    deviceId?: string;
    taskId?: string;
    event?: string;
  }): NetworkLogEntry[] {
    return this.entries
      .filter((entry) =>
        (!filters?.level || entry.level === filters.level) &&
        (!filters?.deviceId || entry.deviceId === filters.deviceId) &&
        (!filters?.taskId || entry.taskId === filters.taskId) &&
        (!filters?.event || entry.event === filters.event)
      )
      .map((entry) => ({ ...entry }));
  }

  clear(): void {
    this.entries.length = 0;
  }
}
