import {
  AIModelRouter,
  AIProviderAdapter,
  AIRequest,
  AIResponse,
} from "./types";

export class ProwoModelRouter implements AIModelRouter {
  private readonly adapters = new Map<string, AIProviderAdapter>();

  register(adapter: AIProviderAdapter): void {
    this.adapters.set(adapter.provider, adapter);
  }

  listProviders(): string[] {
    return Array.from(this.adapters.keys());
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const adapter = this.adapters.get(request.provider);

    if (!adapter) {
      throw new Error(
        `No AI provider adapter is registered for "${request.provider}".`
      );
    }

    return adapter.generate(request);
  }
}
