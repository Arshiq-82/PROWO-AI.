import { Repository } from "../database/repository";
import { DatabaseAdapter } from "../database/types";
import { Task } from "./types";

export class TaskRepository extends Repository<Task> {
  constructor(database: DatabaseAdapter) {
    super(database, "tasks");
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.findMany({ userId });
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return this.findMany({ projectId });
  }

  async findByStatus(status: Task["status"]): Promise<Task[]> {
    return this.findMany({ status });
  }
}
