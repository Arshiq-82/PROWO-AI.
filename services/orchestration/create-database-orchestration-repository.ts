import {
  DatabaseOrchestrationRepository,
  OrchestrationDatabasePort,
} from "./database-orchestration-repository";

export function createDatabaseOrchestrationRepository(
  database: OrchestrationDatabasePort
): DatabaseOrchestrationRepository {
  return new DatabaseOrchestrationRepository(database);
}
