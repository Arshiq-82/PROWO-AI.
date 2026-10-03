import {
  DeviceTask,
  TaskDispatchResult,
} from "./types";
import { DeviceManager } from "./device-manager";

export class TaskDispatcher {
  constructor(private readonly deviceManager: DeviceManager) {}

  dispatch(task: DeviceTask): TaskDispatchResult {
    if (!task.deviceId) {
      return {
        taskId: task.id,
        deviceId: "",
        accepted: false,
        message: "No target device was specified.",
      };
    }

    const device = this.deviceManager.get(task.deviceId);

    if (!device) {
      return {
        taskId: task.id,
        deviceId: task.deviceId,
        accepted: false,
        message: "Target device was not found.",
      };
    }

    if (device.status !== "online") {
      return {
        taskId: task.id,
        deviceId: task.deviceId,
        accepted: false,
        message: `Device is not available: ${device.status}.`,
      };
    }

    if (device.capabilities.maxConcurrentTasks <= 0) {
      return {
        taskId: task.id,
        deviceId: task.deviceId,
        accepted: false,
        message: "Device cannot accept additional tasks.",
      };
    }

    return {
      taskId: task.id,
      deviceId: task.deviceId,
      accepted: true,
      message: "Task accepted for dispatch.",
    };
  }
}
