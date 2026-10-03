import { IntegrationDefinition } from "./types";

export class IntegrationRegistry {
  private readonly integrations = new Map<
    string,
    IntegrationDefinition
  >();

  register(definition: IntegrationDefinition): void {
    if (this.integrations.has(definition.id)) {
      throw new Error(
        `Integration "${definition.id}" is already registered.`
      );
    }

    this.integrations.set(definition.id, {
      ...definition,
    });
  }

  unregister(integrationId: string): boolean {
    return this.integrations.delete(integrationId);
  }

  get(integrationId: string): IntegrationDefinition | undefined {
    const integration = this.integrations.get(integrationId);
    return integration ? { ...integration } : undefined;
  }

  list(): IntegrationDefinition[] {
    return Array.from(this.integrations.values()).map(
      (integration) => ({ ...integration })
    );
  }

  enable(integrationId: string): boolean {
    const integration = this.integrations.get(integrationId);

    if (!integration) {
      return false;
    }

    integration.enabled = true;
    return true;
  }

  disable(integrationId: string): boolean {
    const integration = this.integrations.get(integrationId);

    if (!integration) {
      return false;
    }

    integration.enabled = false;
    return true;
  }
}
