export interface ApiRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: unknown;
  userId?: string;
  requestId?: string;
}

export interface ApiResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  body?: T;
}

export type ApiHandler = (
  request: ApiRequest
) => Promise<ApiResponse> | ApiResponse;

export interface ApiRoute {
  method: string;
  path: string;
  handler: ApiHandler;
  authenticationRequired?: boolean;
}
