import {
  AuditEvent,
  PermissionAction,
} from "./types";

export class AuditLog {
  private readonly events: AuditEvent[] = [];

  record(event: AuditEvent): void {
    this.events.push(event);
  }

  recordDecision(input: {
    userId: string;
    action: PermissionAction;
    result: AuditEvent["result"];
    projectId?: string;
    deviceId?: string;
    resource?: string;
    details?: Record<string, unknown>;
  }): AuditEvent {
    const event: AuditEvent = {
      id: `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...input,
    };

    this.record(event);
    return event;
  }

  list(): AuditEvent[] {
    return [...this.events];
  }

  forUser(userId: string): AuditEvent[] {
    return this.events.filter((event) => event.userId === userId);
  }

  forDevice(deviceId: string): AuditEvent[] {
    return this.events.filter((event) => event.deviceId === deviceId);
  }
}
