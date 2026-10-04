import assert from "node:assert/strict";
import test from "node:test";
import { InMemoryOrchestrationRepository } from "./in-memory-orchestration-repository";

test("creates and retrieves an orchestration record", async () => {
  const repository = new InMemoryOrchestrationRepository();

  const created = await repository.create({
    requestId: "orch-1",
    userId: "user-1",
    message: "Build a program.",
    status: "submitted",
    createdAt: "2026-10-04T00:00:00.000Z",
    updatedAt: "2026-10-04T00:00:00.000Z",
  });

  const stored = await repository.get("orch-1");

  assert.equal(created.requestId, "orch-1");
  assert.equal(stored?.userId, "user-1");
});

test("updates orchestration state without changing request identity", async () => {
  const repository = new InMemoryOrchestrationRepository();

  await repository.create({
    requestId: "orch-2",
    userId: "user-1",
    message: "Run a workflow.",
    status: "submitted",
    createdAt: "2026-10-04T00:00:00.000Z",
    updatedAt: "2026-10-04T00:00:00.000Z",
  });

  const updated = await repository.update("orch-2", {
    status: "completed",
    output: { ok: true },
  });

  assert.equal(updated?.requestId, "orch-2");
  assert.equal(updated?.status, "completed");
  assert.deepEqual(updated?.output, { ok: true });
});
