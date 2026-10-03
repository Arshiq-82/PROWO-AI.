import {
  IntegrationCredential,
  IntegrationDefinition,
  IntegrationRequest,
  IntegrationResponse,
} from "./types";

export interface IntegrationTransport {
  request(
    url: string,
    options: {
      method: string;
      headers: Record<string, string>;
      body?: unknown;
    }
  ): Promise<IntegrationResponse>;
}

export class IntegrationClient {
  constructor(
    private readonly transport: IntegrationTransport
  ) {}

  async request(
    definition: IntegrationDefinition,
    credential: IntegrationCredential | undefined,
    request: IntegrationRequest
  ): Promise<IntegrationResponse> {
    if (!definition.enabled) {
      return {
        status: 403,
        headers: {},
        error: `Integration "${definition.id}" is disabled.`,
      };
    }

    const url = this.buildUrl(
      definition.baseUrl,
      request.path,
      request.query
    );

    const headers = this.buildHeaders(
      definition,
      credential,
      request.headers
    );

    return this.transport.request(url, {
      method: request.method.toUpperCase(),
      headers,
      body: request.body,
    });
  }

  private buildUrl(
    baseUrl: string | undefined,
    path: string,
    query?: Record<string, string>
  ): string {
    const base = baseUrl ?? "";
    const normalizedBase = base.endsWith("/")
      ? base.slice(0, -1)
      : base;
    const normalizedPath = path.startsWith("/")
      ? path
      : `/${path}`;

    const url = `${normalizedBase}${normalizedPath}`;

    if (!query || Object.keys(query).length === 0) {
      return url;
    }

    const search = new URLSearchParams(query).toString();
    return `${url}?${search}`;
  }

  private buildHeaders(
    definition: IntegrationDefinition,
    credential: IntegrationCredential | undefined,
    requestHeaders?: Record<string, string>
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...requestHeaders,
    };

    if (definition.authType === "api_key" && credential?.apiKey) {
      headers["x-api-key"] = credential.apiKey;
    }

    if (
      (definition.authType === "bearer" ||
        definition.authType === "oauth2") &&
      credential?.accessToken
    ) {
      headers.authorization = `Bearer ${credential.accessToken}`;
    }

    if (definition.authType === "basic" && credential?.apiKey) {
      headers.authorization = `Basic ${credential.apiKey}`;
    }

    if (!headers["content-type"] && definition.category !== "storage") {
      headers["content-type"] = "application/json";
    }

    return headers;
  }
}
