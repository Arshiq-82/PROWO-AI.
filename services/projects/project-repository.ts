import { Repository } from "../database/repository";
import { DatabaseAdapter } from "../database/types";
import { Project } from "./types";

export class ProjectRepository extends Repository<Project> {
  constructor(database: DatabaseAdapter) {
    super(database, "projects");
  }

  async findByUser(userId: string): Promise<Project[]> {
    return this.findMany({ userId });
  }

  async findActiveByUser(userId: string): Promise<Project[]> {
    return this.findMany({
      userId,
      status: "active",
    });
  }
}
