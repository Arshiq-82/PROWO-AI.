import { RecoveryTask, RecoveryDecision } from "./types";

export interface FailoverCandidate {
  deviceId: string;
  available: boolean;
  score: number;
}

export class FailoverStrategy {
  choose(
    task: RecoveryTask,
    candidates: FailoverCandidate[]
  ): RecoveryDecision {
    const nextAttempt = task.attempt + 1;
    const available = candidates
      .filter((candidate) => candidate.available)
      .sort((a, b) => b.score - a.score);

    if (nextAttempt > task.maxAttempts) {
      return {
        taskId: task.taskId,
        action: "fail",
        nextAttempt,
        reason: "Maximum recovery attempts reached.",
        createdAt: new Date().toISOString(),
      };
    }

    const sameDevice = task.deviceId
      ? available.find((candidate) => candidate.deviceId === task.deviceId)
      : undefined;

    if (sameDevice) {
      return {
        taskId: task.taskId,
        action: "retry_same_device",
        nextDeviceId: sameDevice.deviceId,
        nextAttempt,
        reason: "Original device is available for another attempt.",
        createdAt: new Date().toISOString(),
      };
    }

    const replacement = available[0];

    if (replacement) {
      return {
        taskId: task.taskId,
        action: "reallocate_device",
        nextDeviceId: replacement.deviceId,
        nextAttempt,
        reason: "Original device is unavailable; task will be reallocated.",
        createdAt: new Date().toISOString(),
      };
    }

    return {
      taskId: task.taskId,
      action: "fail",
      nextAttempt,
      reason: "No available failover device was found.",
      createdAt: new Date().toISOString(),
    };
  }
}
