export interface ApiClientRequest {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
  token?: string;
}

export interface ApiClientResponse<T = unknown> {
  status: number;
  data: T;
}

export interface ApiClientTransport {
  request<T>(request: ApiClientRequest): Promise<ApiClientResponse<T>>;
}
