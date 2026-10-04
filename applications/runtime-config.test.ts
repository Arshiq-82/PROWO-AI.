import assert from "node:assert/strict";
import test from "node:test";
import { createRuntimeConfig } from "./runtime-config";

test("creates deterministic runtime configuration", () => {
  const config = createRuntimeConfig("production");

  assert.equal(config.environment, "production");
  assert.equal(config.version, "0.1.0");
  assert.equal(config.apiPrefix, "/api/v1");
});
