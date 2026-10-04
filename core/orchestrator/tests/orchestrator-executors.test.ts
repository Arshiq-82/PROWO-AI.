import assert from "node:assert/strict";
import test from "node:test";
import { LocalTargetExecutor } from "../executors/local-executor";
import { ConnectedDeviceExecutor } from "../executors/connected-device-executor";
import { WorkflowTargetExecutor } from "../executors/workflow-executor";
import { CodeTargetExecutor } from "../executors/code-executor";
import { ToolTargetExecutor } from "../executors/tool-executor";

const context = {
  request: {
    taskId: "executor-task",
    prompt: "test",
  },
  plan: {
    taskId: "executor-task",
    target: "local" as const,
    steps: [],
    requiresApproval: false,
    createdAt: new Date().toISOString(),
  },
};

test("local executor delegates to its adapter", async () => {
  const executor = new LocalTargetExecutor({
    execute: async () => ({ ok: true }),
  });

  const result = await executor.execute(context);

  assert.equal(result.success, true);
  assert.deepEqual(result.output, { ok: true });
});

test("connected device executor requires a preferred device", async () => {
  const executor = new ConnectedDeviceExecutor({
    execute: async () => ({ ok: true }),
  });

  const result = await executor.execute(context);

  assert.equal(result.success, false);
  assert.match(result.error ?? "", /connected device/i);
});

test("workflow executor delegates to its adapter", async () => {
  const executor = new WorkflowTargetExecutor({
    execute: async () => "workflow-complete",
  });

  const result = await executor.execute(context);

  assert.equal(result.success, true);
  assert.equal(result.output, "workflow-complete");
});

test("code executor delegates to its adapter", async () => {
  const executor = new CodeTargetExecutor({
    execute: async () => ({ files: 2 }),
  });

  const result = await executor.execute(context);

  assert.equal(result.success, true);
  assert.deepEqual(result.output, { files: 2 });
});

test("tool executor delegates to its adapter", async () => {
  const executor = new ToolTargetExecutor({
    execute: async () => ({ tool: "ok" }),
  });

  const result = await executor.execute(context);

  assert.equal(result.success, true);
  assert.deepEqual(result.output, { tool: "ok" });
});
