import assert from "node:assert/strict";
import test from "node:test";
import { ApiRouteRegistry } from "./route-registry";
import { registerOrchestrationRoutes } from "./api-registration";

test("registers orchestration endpoints in the API registry", () => {
  const registry = new ApiRouteRegistry();
  const controller = { submit: async () => ({ statusCode: 200, body: {} }), execute: async () => ({ statusCode: 200, body: {} }) } as never;
  registerOrchestrationRoutes(registry, controller);
  const routes = registry.list();
  assert.equal(routes.some((r) => r.method === "POST" && r.path === "/api/v1/orchestrations"), true);
  assert.equal(routes.some((r) => r.method === "POST" && r.path === "/api/v1/orchestrations/:requestId/execute"), true);
});
