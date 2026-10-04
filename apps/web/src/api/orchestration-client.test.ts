import assert from "node:assert/strict";
import test from "node:test";
import { OrchestrationClient } from "./orchestration-client";
import type {
  ApiClientRequest,
  ApiClientResponse,
} from "./api-client-types";

test("submits orchestration requests through the API transport", async () => {
  let received: any;

  const client = new OrchestrationClient({
    request: async <T>(
      request: ApiClientRequest
    ): Promise<ApiClientResponse<T>> => {
      received = request;

      return {
        status: 200,
        data: {
          requestId: "orch-1",
          status: "completed",
        } as T,
      };
    },
  });

  const result = await client.submit(
    {
      message: "Build a program.",
    },
    "token"
  );

  assert.equal(result.status, 200);
  assert.equal(received.method, "POST");
  assert.equal(received.path, "/api/v1/orchestrations");
  assert.equal(received.token, "token");
});
