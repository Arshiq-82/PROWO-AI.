import assert from "node:assert/strict";
import test from "node:test";
import { OrchestratorApprovalGate } from "../approval-gate";

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

test("approval gate creates a pending approval", () => {
  const gate = new OrchestratorApprovalGate(
    new FakeApprovalManager() as never
  );

  const result = gate.request({
    taskId: "approval-task",
    action: "execute_program",
    reason: "Execution requires approval.",
    userId: "user-1",
  });

  assert.equal(result.required, true);
  assert.equal(result.approved, false);
  assert.equal(result.approvalId, "approval-1");
});

test("approval gate accepts an approved request", () => {
  const gate = new OrchestratorApprovalGate(
    new FakeApprovalManager() as never
  );

  const result = gate.approve("approval-1", "user-1");

  assert.equal(result.approved, true);
});
