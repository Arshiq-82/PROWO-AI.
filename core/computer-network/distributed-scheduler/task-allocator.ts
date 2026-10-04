import { DeviceCapacity, SchedulingTask, TaskAllocation } from "./types";

export class TaskAllocator {
  allocate(task: SchedulingTask, devices: DeviceCapacity[]): TaskAllocation | undefined {
    const eligible = devices
      .filter((device) => device.available && device.activeTasks < device.maxConcurrentTasks)
      .sort(
        (a, b) =>
          a.activeTasks / Math.max(a.maxConcurrentTasks, 1) -
          b.activeTasks / Math.max(b.maxConcurrentTasks, 1)
      );

    if (task.preferredDeviceId) {
      const preferred = eligible.find(
        (device) => device.deviceId === task.preferredDeviceId
      );
      if (preferred) return this.createAllocation(task, preferred.deviceId);
    }

    const selected = eligible[0];
    return selected
      ? this.createAllocation(task, selected.deviceId)
      : undefined;
  }

  private createAllocation(task: SchedulingTask, deviceId: string): TaskAllocation {
    return {
      taskId: task.taskId,
      deviceId,
      priority: task.priority,
      status: "allocated",
      attempt: 1,
      allocatedAt: new Date().toISOString(),
    };
  }
}
