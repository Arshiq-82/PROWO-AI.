export type NotificationType =
  | "task"
  | "workflow"
  | "approval"
  | "device"
  | "system"
  | "error";

export type NotificationPriority = "low" | "normal" | "high" | "critical";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  readAt?: string;
  projectId?: string;
  taskId?: string;
  deviceId?: string;
  metadata?: Record<string, unknown>;
}

export interface CreateNotificationInput {
  id: string;
  userId: string;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  projectId?: string;
  taskId?: string;
  deviceId?: string;
  metadata?: Record<string, unknown>;
}
