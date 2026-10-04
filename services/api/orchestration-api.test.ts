import assert from "node:assert/strict";
import test from "node:test";
import { OrchestrationRoutes } from "./orchestration-routes";

test("exposes orchestration submit and execute routes", () => {
  const controller = { submit: async () => ({ statusCode: 200, body: {} }), execute: async () => ({ statusCode: 200, body: {} }) } as never;
  const definitions = new OrchestrationRoutes(controller).definitions();
  assert.deepEqual(definitions.map((r) => `${r.method} ${r.path}`), ["POST /api/v1/orchestrations", "POST /api/v1/orchestrations/:requestId/execute"]);
});

test("submit route delegates to controller", async () => {
  let received: unknown;
  const controller = { submit: async (request: unknown) => { received = request; return { statusCode: 200, body: {} }; }, execute: async () => ({ statusCode: 200, body: {} }) } as never;
  const request = { body: { userId: "user-1", message: "Build a program." } };
  const response = await new OrchestrationRoutes(controller).definitions()[0].handler({ request });
  assert.deepEqual(received, request); assert.equal(response.statusCode, 200);
});

test("execute route delegates to controller", async () => {
  let received: unknown;
  const controller = { submit: async () => ({ statusCode: 200, body: {} }), execute: async (request: unknown) => { received = request; return { statusCode: 200, body: {} }; } } as never;
  const request = { params: { requestId: "orch_123" } };
  const response = await new OrchestrationRoutes(controller).definitions()[1].handler({ request });
  assert.deepEqual(received, request); assert.equal(response.statusCode, 200);
});
