import {
  RealtimeEvent,
  RealtimeEventType,
  RealtimeListener,
} from "./types";

export class RealtimeEventBus {
  private readonly listeners = new Map<
    RealtimeEventType,
    Set<RealtimeListener>
  >();

  subscribe(
    type: RealtimeEventType,
    listener: RealtimeListener
  ): () => void {
    let listeners = this.listeners.get(type);

    if (!listeners) {
      listeners = new Set<RealtimeListener>();
      this.listeners.set(type, listeners);
    }

    listeners.add(listener);

    return () => {
      listeners?.delete(listener);
    };
  }

  async publish(event: RealtimeEvent): Promise<void> {
    const listeners = this.listeners.get(event.type);

    if (!listeners) {
      return;
    }

    await Promise.all(
      Array.from(listeners).map((listener) => listener(event))
    );
  }

  clear(type?: RealtimeEventType): void {
    if (type) {
      this.listeners.delete(type);
      return;
    }

    this.listeners.clear();
  }
}
