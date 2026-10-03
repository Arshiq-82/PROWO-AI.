import { NotificationStore } from "./notification-store";
import {
  CreateNotificationInput,
  Notification,
} from "./types";

export class NotificationService {
  constructor(private readonly store: NotificationStore) {}

  create(input: CreateNotificationInput): Notification {
    const title = input.title.trim();
    const message = input.message.trim();

    if (!title) {
      throw new Error("Notification title is required.");
    }

    if (!message) {
      throw new Error("Notification message is required.");
    }

    return this.store.create({
      ...input,
      title,
      message,
    });
  }

  get(notificationId: string): Notification | undefined {
    return this.store.get(notificationId);
  }

  list(userId: string): Notification[] {
    return this.store.listForUser(userId);
  }

  unread(userId: string): Notification[] {
    return this.store.unreadForUser(userId);
  }

  markRead(notificationId: string): Notification | undefined {
    return this.store.markRead(notificationId);
  }

  markAllRead(userId: string): number {
    return this.store.markAllRead(userId);
  }

  delete(notificationId: string): boolean {
    return this.store.delete(notificationId);
  }
}
