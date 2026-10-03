import { ApiHandler, ApiRoute } from "./types";

function normalizeMethod(method: string): string {
  return method.trim().toUpperCase();
}

function normalizePath(path: string): string {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }

  return path.length > 1 && path.endsWith("/")
    ? path.slice(0, -1)
    : path;
}

export class ApiRouteRegistry {
  private readonly routes = new Map<string, ApiRoute>();

  register(
    method: string,
    path: string,
    handler: ApiHandler,
    authenticationRequired = true
  ): void {
    const normalizedMethod = normalizeMethod(method);
    const normalizedPath = normalizePath(path);
    const key = `${normalizedMethod} ${normalizedPath}`;

    if (this.routes.has(key)) {
      throw new Error(`API route "${key}" is already registered.`);
    }

    this.routes.set(key, {
      method: normalizedMethod,
      path: normalizedPath,
      handler,
      authenticationRequired,
    });
  }

  unregister(method: string, path: string): boolean {
    return this.routes.delete(
      `${normalizeMethod(method)} ${normalizePath(path)}`
    );
  }

  get(method: string, path: string): ApiRoute | undefined {
    return this.routes.get(
      `${normalizeMethod(method)} ${normalizePath(path)}`
    );
  }

  list(): ApiRoute[] {
    return Array.from(this.routes.values());
  }
}
