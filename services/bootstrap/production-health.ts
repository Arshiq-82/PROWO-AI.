import { ApplicationHealth, getApplicationHealth } from "../../applications/application-health";

export interface ProductionHealthProvider {
  isReady(): boolean;
  version(): string;
  snapshot(): ApplicationHealth;
}

export class DefaultProductionHealthProvider
  implements ProductionHealthProvider
{
  constructor(
    private readonly versionValue: string,
    private readonly readiness: () => boolean
  ) {}

  isReady(): boolean {
    return this.readiness();
  }

  version(): string {
    return this.versionValue;
  }

  snapshot(): ApplicationHealth {
    return getApplicationHealth(
      this.versionValue,
      this.readiness()
    );
  }
}
