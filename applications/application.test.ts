import assert from "node:assert/strict";
import test from "node:test";
import { createProwoApplication } from "./application";

test("creates the Prowo application shell", () => {
  const app = createProwoApplication({
    apiRegistry: {} as never,
    start: async () => {},
    stop: async () => {},
  });

  assert.equal(app.name, "prowo");
  assert.equal(app.version, "0.1.0");
  assert.ok(app.apiRegistry);
});
