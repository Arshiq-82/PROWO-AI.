export interface Migration {
  id: string;
  description: string;
  up(): Promise<void>;
  down(): Promise<void>;
}

export class MigrationManager {
  private readonly migrations = new Map<string, Migration>();
  private readonly applied = new Set<string>();

  register(migration: Migration): void {
    if (this.migrations.has(migration.id)) {
      throw new Error(`Migration "${migration.id}" is already registered.`);
    }

    this.migrations.set(migration.id, migration);
  }

  async migrate(): Promise<string[]> {
    const appliedNow: string[] = [];

    for (const migration of this.migrations.values()) {
      if (this.applied.has(migration.id)) {
        continue;
      }

      await migration.up();
      this.applied.add(migration.id);
      appliedNow.push(migration.id);
    }

    return appliedNow;
  }

  async rollback(migrationId: string): Promise<boolean> {
    const migration = this.migrations.get(migrationId);

    if (!migration || !this.applied.has(migrationId)) {
      return false;
    }

    await migration.down();
    this.applied.delete(migrationId);
    return true;
  }

  listApplied(): string[] {
    return Array.from(this.applied);
  }
}
