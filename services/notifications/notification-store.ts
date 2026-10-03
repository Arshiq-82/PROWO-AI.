import {
  CreateNotificationInput,
  Notification,
} from "./types";

export class NotificationStore {
  private readonly notifications = new Map<string, Notification>();

  create(input: CreateNotificationInput): Notification {
    if (this.notifications.has(input.id)) {
      throw new Error(`Notification "${input.id}" already exists.`);
    }

    const notification: Notification = {
      ...input,
      priority: input.priority ?? "normal",
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.notifications.set(notification.id, notification);
    return { ...notification };
  }

  get(id: string): Notification | undefined {
    const notification = this.notifications.get(id);
    return notification ? { ...notification } : undefined;
  }

  listForUser(userId: string): Notification[] {
    return Array.from(this.notifications.values())
      .filter((notification) => notification.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .map((notification) => ({ ...notification }));
  }

  unreadForUser(userId: string): Notification[] {
    return this.listForUser(userId).filter(
      (notification) => !notification.read
    );
  }

  markRead(id: string): Notification | undefined {
    const notification = this.notifications.get(id);

    if (!notification) {
      return undefined;
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();

    return { ...notification };
  }

  markAllRead(userId: string): number {
    let count = 0;

    for (const notification of this.notifications.values()) {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        notification.readAt = new Date().toISOString();
        count += 1;
      }
    }

    return count;
  }

  delete(id: string): boolean {
    return this.notifications.delete(id);
  }
}
