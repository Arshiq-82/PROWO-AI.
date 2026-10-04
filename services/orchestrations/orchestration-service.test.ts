import assert from "node:assert/strict";
import test from "node:test";
import { OrchestrationService } from "./orchestration-service";

test("submits a user request into the orchestrator runtime", async () => {
  const service = new OrchestrationService({
    handle: async (request) => ({
      requestId: request.taskId,
      status: "completed",
      target: "code_generation",
      output: { generated: true },
    }),
  });

  const result = await service.submit({
    userId: "user-1",
    message: "Build a program.",
    projectId: "project-1",
  });

  assert.equal(result.status, "completed");
  assert.equal(result.target, "code_generation");
  assert.deepEqual(result.output, { generated: true });
});

test("returns awaiting approval without hiding the approval state", async () => {
  const service = new OrchestrationService({
    handle: async (request) => ({
      requestId: request.taskId,
      status: "awaiting_approval",
      target: "local",
      approvalId: "approval-42",
    }),
  });

  const result = await service.submit({
    userId: "user-1",
    message: "Execute a local program.",
  });

  assert.equal(result.status, "awaiting_approval");
  assert.equal(result.awaitingApproval, true);
  assert.equal(result.approvalId, "approval-42");
});

test("returns a failed response for an unknown request", async () => {
  const service = new OrchestrationService({
    handle: async () => ({
      requestId: "unused",
      status: "completed",
    }),
  });

  const result = await service.execute("missing-request");

  assert.equal(result.status, "failed");
  assert.equal(result.error, "Orchestration request not found.");
});
