import { IntegrationClient } from "./integration-client";
import { IntegrationRegistry } from "./integration-registry";
import {
  IntegrationCredential,
  IntegrationRequest,
  IntegrationResponse,
} from "./types";

export class IntegrationManager {
  private readonly credentials = new Map<string, IntegrationCredential>();

  constructor(
    readonly registry: IntegrationRegistry,
    readonly client: IntegrationClient
  ) {}

  saveCredential(credential: IntegrationCredential): void {
    const key = this.credentialKey(
      credential.userId,
      credential.integrationId
    );

    this.credentials.set(key, {
      ...credential,
    });
  }

  removeCredential(
    userId: string,
    integrationId: string
  ): boolean {
    return this.credentials.delete(
      this.credentialKey(userId, integrationId)
    );
  }

  async request(
    request: IntegrationRequest
  ): Promise<IntegrationResponse> {
    const integration = this.registry.get(request.integrationId);

    if (!integration) {
      return {
        status: 404,
        headers: {},
        error: `Integration "${request.integrationId}" was not found.`,
      };
    }

    const credential = this.credentials.get(
      this.credentialKey(request.userId, request.integrationId)
    );

    return this.client.request(
      integration,
      credential,
      request
    );
  }

  private credentialKey(
    userId: string,
    integrationId: string
  ): string {
    return `${userId}:${integrationId}`;
  }
}
