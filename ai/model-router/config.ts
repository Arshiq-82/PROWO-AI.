import { AIProvider } from "./types";

export interface ProviderConfig {
  provider: AIProvider;
  defaultModel: string;
  enabled: boolean;
  apiKeyEnv?: string;
  baseUrl?: string;
}

export const modelRouterConfig: ProviderConfig[] = [
  {
    provider: "openai",
    defaultModel: "configured-at-runtime",
    enabled: true,
    apiKeyEnv: "OPENAI_API_KEY",
  },
  {
    provider: "google",
    defaultModel: "configured-at-runtime",
    enabled: true,
    apiKeyEnv: "GOOGLE_AI_API_KEY",
  },
  {
    provider: "anthropic",
    defaultModel: "configured-at-runtime",
    enabled: true,
    apiKeyEnv: "ANTHROPIC_API_KEY",
  },
  {
    provider: "xai",
    defaultModel: "configured-at-runtime",
    enabled: true,
    apiKeyEnv: "XAI_API_KEY",
  },
  {
    provider: "local",
    defaultModel: "local-development",
    enabled: true,
  },
];

export function getProviderConfig(
  provider: AIProvider
): ProviderConfig | undefined {
  return modelRouterConfig.find((config) => config.provider === provider);
}
