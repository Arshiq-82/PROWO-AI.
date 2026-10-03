export type AIProvider =
  | "openai"
  | "google"
  | "anthropic"
  | "xai"
  | "local";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIRequest {
  provider: AIProvider;
  model: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
}

export interface AIResponse {
  provider: AIProvider;
  model: string;
  content: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  requestId?: string;
}

export interface AIProviderAdapter {
  provider: AIProvider;
  generate(request: AIRequest): Promise<AIResponse>;
}

export interface AIModelRouter {
  register(adapter: AIProviderAdapter): void;
  listProviders(): AIProvider[];
  generate(request: AIRequest): Promise<AIResponse>;
}
