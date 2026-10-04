import assert from "node:assert/strict";
import test from "node:test";
import { OrchestratorTaskRouter } from "../task-router";

test("routes connected computer requests to connected_device", () => {
  const router = new OrchestratorTaskRouter();

  const result = router.route({
    taskId: "route-1",
    prompt: "Run this task on my connected computer.",
  });

  assert.equal(result.target, "connected_device");
  assert.equal(result.confidence, 0.95);
});

test("routes automation requests to workflow", () => {
  const router = new OrchestratorTaskRouter();

  const result = router.route({
    taskId: "route-2",
    prompt: "Automate this and schedule it every day.",
  });

  assert.equal(result.target, "workflow");
});

test("routes code requests to code_generation", () => {
  const router = new OrchestratorTaskRouter();

  const result = router.route({
    taskId: "route-3",
    prompt: "Build an app and generate the code.",
  });

  assert.equal(result.target, "code_generation");
});

test("explicit target takes precedence", () => {
  const router = new OrchestratorTaskRouter();

  const result = router.route({
    taskId: "route-4",
    prompt: "Build an app.",
    target: "external_tool",
  });

  assert.equal(result.target, "external_tool");
  assert.equal(result.confidence, 1);
});
