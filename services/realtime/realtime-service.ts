import { ConnectionManager } from "./connection-manager";
import { RealtimeEventBus } from "./event-bus";
import {
  RealtimeEvent,
  RealtimeEventType,
} from "./types";

export class RealtimeService {
  constructor(
    readonly events: RealtimeEventBus = new RealtimeEventBus(),
    readonly connections: ConnectionManager = new ConnectionManager()
  ) {}

  async emit<T>(
    type: RealtimeEventType,
    payload: T,
    options: Omit<
      RealtimeEvent<T>,
      "id" | "type" | "timestamp" | "payload"
    > = {}
  ): Promise<RealtimeEvent<T>> {
    const event: RealtimeEvent<T> = {
      id: this.createEventId(),
      type,
      timestamp: new Date().toISOString(),
      ...options,
      payload,
    };

    await this.events.publish(event);
    return event;
  }

  subscribe(
    type: RealtimeEventType,
    listener: (
      event: RealtimeEvent
    ) => void | Promise<void>
  ): () => void {
    return this.events.subscribe(type, listener);
  }

  private createEventId(): string {
    return `evt_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}
