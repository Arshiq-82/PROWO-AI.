import assert from "node:assert/strict";
import test from "node:test";
import {
  createProductionOrchestrationService,
} from "./orchestration-service-factory";
import { StaticOrchestrationRuntimeProvider } from "./orchestration-runtime-provider";

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

test("production factory wires runtime to database-backed orchestration", async () => {
  const service = createProductionOrchestrationService({
    runtime: new StaticOrchestrationRuntimeProvider({
      handle: async (request) => ({
        requestId: request.taskId,
        status: "completed",
        target: "code_generation",
        output: { generated: true },
      }),
    }),
    database: new FakeDatabase(),
  });

  const result = await service.submit({
    userId: "user-1",
    message: "Build a program.",
  });

  assert.equal(result.status, "completed");
  assert.equal(result.target, "code_generation");
  assert.deepEqual(result.output, { generated: true });
});
