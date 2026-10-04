import assert from "node:assert/strict";
import test from "node:test";
import { ProwoApiClient } from "./api-client";

test("adds authentication and JSON request headers", async () => {
  let request: RequestInit | undefined;

  const client = new ProwoApiClient(
    "http://localhost:3000",
    async (_input, init) => {
      request = init;
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  );

  const result = await client.request({
    method: "POST",
    path: "/api/v1/orchestrations",
    body: { message: "Hello" },
    token: "abc",
  });

  assert.equal(result.status, 200);
  assert.equal(
    (request?.headers as Record<string, string>)["Authorization"],
    "Bearer abc"
  );
  assert.equal(
    (request?.headers as Record<string, string>)["Content-Type"],
    "application/json"
  );
});
