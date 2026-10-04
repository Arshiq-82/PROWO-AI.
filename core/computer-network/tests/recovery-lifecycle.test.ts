import assert from "node:assert/strict";
import test from "node:test";
import { FailoverStrategy } from "../task-recovery/failover-strategy";
import { RetryManager } from "../task-recovery/retry-manager";
import { TaskLifecycleManager } from "../task-lifecycle/lifecycle-manager";

test("lifecycle accepts a normal execution path", () => {
  const lifecycle = new TaskLifecycleManager();
  const taskId = "lifecycle-task";

  assert.equal(lifecycle.create(taskId).success, true);
  assert.equal(
    lifecycle.transition(taskId, "task.queued").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.planned").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.scheduled").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.allocated").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.dispatched").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.started").success,
    true
  );
  assert.equal(
    lifecycle.transition(taskId, "task.completed").success,
    true
  );

  assert.equal(lifecycle.get(taskId)?.state, "completed");
});

test("failover chooses another available device when the original is unavailable", () => {
  const strategy = new FailoverStrategy();

  const decision = strategy.choose(
    {
      taskId: "recovery-task",
      deviceId: "offline-device",
      attempt: 1,
      maxAttempts: 3,
      reason: "device_offline",
    },
    [
      {
        deviceId: "replacement-device",
        available: true,
        score: 90,
      },
    ]
  );

  assert.equal(decision.action, "reallocate_device");
  assert.equal(decision.nextDeviceId, "replacement-device");
  assert.equal(decision.nextAttempt, 2);
});

test("retry manager uses bounded exponential backoff", () => {
  const retry = new RetryManager();

  const delay1 = retry.delayForAttempt(1);
  const delay3 = retry.delayForAttempt(3);

  assert.ok(delay1 >= 1000);
  assert.ok(delay3 <= 60000);
  assert.equal(
    retry.shouldRetry({
      taskId: "retry-task",
      attempt: 1,
      maxAttempts: 3,
      reason: "execution_failure",
    }),
    true
  );
});
