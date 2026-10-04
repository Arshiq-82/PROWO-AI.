import assert from "node:assert/strict";
import test from "node:test";
import { DistributedQueueManager } from "../distributed-queue/queue-manager";
import { DistributedScheduler } from "../distributed-scheduler/scheduler";
import { SchedulingPolicyManager } from "../distributed-scheduler/scheduling-policy";

test("priority queue returns higher priority tasks first", () => {
  const queue = new DistributedQueueManager();

  queue.enqueue({
    taskId: "low-task",
    priority: "low",
    payload: {},
  });

  queue.enqueue({
    taskId: "critical-task",
    priority: "critical",
    payload: {},
  });

  queue.enqueue({
    taskId: "normal-task",
    priority: "normal",
    payload: {},
  });

  const lease = queue.leaseNext("worker-1");

  assert.equal(lease?.taskId, "critical-task");
});

test("scheduler allocates an available device with capacity", () => {
  const scheduler = new DistributedScheduler(
    new SchedulingPolicyManager()
  );

  const result = scheduler.schedule(
    {
      taskId: "scheduled-task",
      priority: "normal",
    },
    [
      {
        deviceId: "busy",
        maxConcurrentTasks: 1,
        activeTasks: 1,
        available: true,
      },
      {
        deviceId: "available",
        maxConcurrentTasks: 4,
        activeTasks: 0,
        available: true,
      },
    ]
  );

  assert.equal(result.accepted, true);
  assert.equal(result.allocation?.deviceId, "available");
});
