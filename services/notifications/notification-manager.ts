import { NotificationService } from "./notification-service";
import {
  CreateNotificationInput,
  Notification,
} from "./types";

export class NotificationManager {
  constructor(private readonly service: NotificationService) {}

  create(input: CreateNotificationInput): Notification {
    return this.service.create(input);
  }

  get(notificationId: string): Notification | undefined {
    return this.service.get(notificationId);
  }

  list(userId: string): Notification[] {
    return this.service.list(userId);
  }

  unread(userId: string): Notification[] {
    return this.service.unread(userId);
  }

  markRead(notificationId: string): Notification | undefined {
    return this.service.markRead(notificationId);
  }

  markAllRead(userId: string): number {
    return this.service.markAllRead(userId);
  }

  delete(notificationId: string): boolean {
    return this.service.delete(notificationId);
  }
}
