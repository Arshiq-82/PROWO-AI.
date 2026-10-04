import assert from "node:assert/strict";
import test from "node:test";
import { PersistentOrchestrationService } from "./persistent-orchestration-service";
import { InMemoryOrchestrationRepository } from "./in-memory-orchestration-repository";

test("persists the orchestration lifecycle result", async () => {
  const repository = new InMemoryOrchestrationRepository();

  const service = new PersistentOrchestrationService(
    {
      handle: async (request) => ({
        requestId: request.taskId,
        status: "completed",
        target: "code_generation",
        output: { generated: true },
      }),
    },
    repository
  );

  const result = await service.submit({
    userId: "user-1",
    message: "Build a program.",
  });

  const record = await repository.get(result.requestId);

  assert.equal(result.status, "completed");
  assert.equal(record?.status, "completed");
  assert.equal(record?.target, "code_generation");
  assert.deepEqual(record?.output, { generated: true });
});

test("persists failures from the orchestrator", async () => {
  const repository = new InMemoryOrchestrationRepository();

  const service = new PersistentOrchestrationService(
    {
      handle: async () => {
        throw new Error("executor unavailable");
      },
    },
    repository
  );

  const result = await service.submit({
    userId: "user-1",
    message: "Run the task.",
  });

  const record = await repository.get(result.requestId);

  assert.equal(result.status, "failed");
  assert.equal(record?.status, "failed");
  assert.equal(record?.error, "executor unavailable");
});
