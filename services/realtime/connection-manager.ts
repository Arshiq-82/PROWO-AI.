import {
  RealtimeConnection,
  RealtimeEvent,
} from "./types";

export class ConnectionManager {
  private readonly connections = new Map<string, RealtimeConnection>();

  add(
    connection: Omit<RealtimeConnection, "connectedAt">
  ): RealtimeConnection {
    const stored: RealtimeConnection = {
      ...connection,
      connectedAt: new Date().toISOString(),
    };

    this.connections.set(stored.id, stored);
    return { ...stored };
  }

  get(connectionId: string): RealtimeConnection | undefined {
    const connection = this.connections.get(connectionId);
    return connection ? { ...connection } : undefined;
  }

  remove(connectionId: string): boolean {
    return this.connections.delete(connectionId);
  }

  list(): RealtimeConnection[] {
    return Array.from(this.connections.values()).map((connection) => ({
      ...connection,
    }));
  }

  forUser(userId: string): RealtimeConnection[] {
    return this.list().filter(
      (connection) => connection.userId === userId
    );
  }

  forDevice(deviceId: string): RealtimeConnection[] {
    return this.list().filter(
      (connection) => connection.deviceId === deviceId
    );
  }

  recipients(event: RealtimeEvent): RealtimeConnection[] {
    return this.list().filter((connection) => {
      if (event.deviceId && connection.deviceId === event.deviceId) {
        return true;
      }

      if (event.userId && connection.userId === event.userId) {
        return true;
      }

      return false;
    });
  }
}
