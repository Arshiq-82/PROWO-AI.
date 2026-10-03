import { ProjectService } from "./project-service";
import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "./types";

export class ProjectManager {
  constructor(private readonly service: ProjectService) {}

  async create(input: CreateProjectInput): Promise<Project> {
    return this.service.create(input);
  }

  async get(projectId: string): Promise<Project | undefined> {
    return this.service.get(projectId);
  }

  async list(userId: string): Promise<Project[]> {
    return this.service.listForUser(userId);
  }

  async update(
    projectId: string,
    changes: UpdateProjectInput
  ): Promise<Project | undefined> {
    return this.service.update(projectId, changes);
  }

  async archive(projectId: string): Promise<Project | undefined> {
    return this.service.archive(projectId);
  }
}
