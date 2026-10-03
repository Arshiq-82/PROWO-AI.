import {
  AIProviderAdapter,
  AIRequest,
  AIResponse,
} from "./types";

/**
 * Development adapter.
 *
 * Real provider adapters will be added separately so API keys and
 * provider-specific SDKs never leak into the central router.
 */
export class MockAIAdapter implements AIProviderAdapter {
  provider = "local" as const;

  async generate(request: AIRequest): Promise<AIResponse> {
    const lastUserMessage =
      [...request.messages]
        .reverse()
        .find((message) => message.role === "user")?.content ?? "";

    return {
      provider: this.provider,
      model: request.model,
      content: `Prowo development response: ${lastUserMessage}`,
      requestId: `mock_${Date.now()}`,
    };
  }
}
