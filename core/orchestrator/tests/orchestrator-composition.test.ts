import assert from "node:assert/strict";
import test from "node:test";
import { createOrchestratorRuntime } from "../orchestrator-runtime-factory";
import { TargetExecutorRegistry } from "../target-executor-registry";

class FakeApprovalManager {
  create(input: Record<string, unknown>) {
    return { id: "approval-1", status: "pending", ...input };
  }

  approve(id: string) {
    return { id, status: "approved" };
  }

  reject(id: string) {
    return { id, status: "rejected" };
  }
}

test("runtime factory exposes the orchestration dependency graph", () => {
  const bundle = createOrchestratorRuntime(
    new FakeApprovalManager() as never,
    (registry: TargetExecutorRegistry) => {
      registry.register("local", {
        execute: async () => "local-result",
      });
      registry.register("workflow", {
        execute: async () => "workflow-result",
      });
    }
  );

  assert.ok(bundle.runtime);
  assert.ok(bundle.adapter);
  assert.ok(bundle.service);
  assert.ok(bundle.controller);

  assert.equal(bundle.executors.has("local"), true);
  assert.equal(bundle.executors.has("workflow"), true);
});

test("runtime executes a registered target executor", async () => {
  const bundle = createOrchestratorRuntime(
    new FakeApprovalManager() as never,
    (registry: TargetExecutorRegistry) => {
      registry.register("local", {
        execute: async () => ({ executed: true }),
      });
    }
  );

  const result = await bundle.runtime.run({
    taskId: "runtime-task",
    prompt: "Run a local task.",
    target: "local",
  });

  assert.equal(result.status, "completed");
  assert.deepEqual(result.output, { executed: true });
});
