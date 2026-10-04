import assert from "node:assert/strict";
import test from "node:test";
import { OrchestrationStateManager } from "./orchestration-state";

test("maps completed API results into frontend orchestration state", async () => {
  const manager = new OrchestrationStateManager({
    submit: async () => ({
      status: 200,
      data: {
        requestId: "orch-1",
        status: "completed",
        target: "code_generation",
        output: { generated: true },
      },
    }),
    execute: async () => ({
      status: 200,
      data: {
        requestId: "orch-1",
        status: "completed",
      },
    }),
  } as never);

  const state = await manager.submit({
    message: "Build a program.",
  });

  assert.equal(state.status, "completed");
  assert.equal(state.requestId, "orch-1");
  assert.equal(state.target, "code_generation");
});
