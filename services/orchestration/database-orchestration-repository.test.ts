import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseOrchestrationRepository } from "./database-orchestration-repository";

class FakeDatabase {
  private readonly records = new Map<string, Record<string, unknown>>();

  async insert(record: Record<string, unknown>) {
    this.records.set(String(record.id), { ...record });
    return { ...record };
  }

  async findById(id: string) {
    const record = this.records.get(id);
    return record ? { ...record } : undefined;
  }

  async update(id: string, patch: Record<string, unknown>) {
    const current = this.records.get(id);
    if (!current) return undefined;

    const updated = { ...current, ...patch };
    this.records.set(id, updated);
    return { ...updated };
  }
}

test("persists orchestration records through the database port", async () => {
  const repository = new DatabaseOrchestrationRepository(
    new FakeDatabase()
  );

  const record = await repository.create({
    requestId: "orch-db-1",
    userId: "user-1",
    message: "Build a program.",
    status: "submitted",
    createdAt: "2026-10-04T00:00:00.000Z",
    updatedAt: "2026-10-04T00:00:00.000Z",
  });

  const stored = await repository.get("orch-db-1");

  assert.equal(record.requestId, "orch-db-1");
  assert.equal(stored?.userId, "user-1");
});

test("updates orchestration state through the database port", async () => {
  const repository = new DatabaseOrchestrationRepository(
    new FakeDatabase()
  );

  await repository.create({
    requestId: "orch-db-2",
    userId: "user-1",
    message: "Run a workflow.",
    status: "submitted",
    createdAt: "2026-10-04T00:00:00.000Z",
    updatedAt: "2026-10-04T00:00:00.000Z",
  });

  const updated = await repository.update("orch-db-2", {
    status: "completed",
    output: { ok: true },
  });

  assert.equal(updated?.status, "completed");
  assert.deepEqual(updated?.output, { ok: true });
});
