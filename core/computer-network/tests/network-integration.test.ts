import assert from "node:assert/strict";
import test from "node:test";
import { DistributedQueueManager } from "../distributed-queue/queue-manager";
import { SchedulingPolicyManager } from "../distributed-scheduler/scheduling-policy";
import { DistributedScheduler } from "../distributed-scheduler/scheduler";
import { TaskExecutionCoordinator } from "../task-coordination/execution-coordinator";
import { TaskLifecycleManager } from "../task-lifecycle/lifecycle-manager";

test("network task flow moves from queue to coordinated execution", async () => {
  const queue = new DistributedQueueManager();
  const policy = new SchedulingPolicyManager();
  const scheduler = new DistributedScheduler(policy);
  const lifecycle = new TaskLifecycleManager();

  const coordinator = new TaskExecutionCoordinator(
    undefined,
    {
      dispatch: async () => true,
    }
  );

  const taskId = "integration-task-1";

  assert.equal(
    lifecycle.create(taskId).success,
    true
  );

  assert.equal(
    queue.enqueue({
      taskId,
      priority: "high",
      payload: { action: "test" },
      maxAttempts: 3,
    }).success,
    true
  );

  const allocation = scheduler.schedule(
    {
      taskId,
      priority: "high",
      requiredCapabilities: ["node"],
    },
    [
      {
        deviceId: "device-1",
        maxConcurrentTasks: 4,
        activeTasks: 0,
        available: true,
      },
    ]
  );

  assert.equal(allocation.accepted, true);
  assert.equal(allocation.allocation?.deviceId, "device-1");

  const coordinated = await coordinator.coordinate({
    taskId,
    priority: "high",
    deviceId: "device-1",
    maxAttempts: 3,
    payload: { action: "test" },
  });

  assert.equal(coordinated.accepted, true);
  assert.equal(coordinated.assignment?.status, "running");
});
