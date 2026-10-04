import {
  ApiClientRequest,
  ApiClientResponse,
  ApiClientTransport,
} from "./api-client-types";

export class ProwoApiClient implements ApiClientTransport {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchImpl: typeof fetch = fetch
  ) {}

  async request<T>(
    request: ApiClientRequest
  ): Promise<ApiClientResponse<T>> {
    const response = await this.fetchImpl(
      `${this.baseUrl}${request.path}`,
      {
        method: request.method,
        headers: {
          "Content-Type": "application/json",
          ...(request.token
            ? { Authorization: `Bearer ${request.token}` }
            : {}),
        },
        body:
          request.body === undefined
            ? undefined
            : JSON.stringify(request.body),
      }
    );

    const data = (await response.json()) as T;

    return {
      status: response.status,
      data,
    };
  }
}
