import { ProjectRepository } from "./project-repository";
import {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "./types";

export class ProjectService {
  constructor(private readonly repository: ProjectRepository) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const name = input.name.trim();

    if (!name) {
      throw new Error("Project name is required.");
    }

    return this.repository.create({
      id: input.id,
      userId: input.userId,
      name,
      description: input.description?.trim(),
      status: "active",
      metadata: input.metadata,
    });
  }

  async get(projectId: string): Promise<Project | undefined> {
    return this.repository.findById(projectId);
  }

  async listForUser(userId: string): Promise<Project[]> {
    return this.repository.findByUser(userId);
  }

  async update(
    projectId: string,
    changes: UpdateProjectInput
  ): Promise<Project | undefined> {
    if (changes.name !== undefined && !changes.name.trim()) {
      throw new Error("Project name cannot be empty.");
    }

    return this.repository.update(projectId, {
      ...changes,
      name: changes.name?.trim(),
      description: changes.description?.trim(),
    });
  }

  async archive(projectId: string): Promise<Project | undefined> {
    return this.repository.update(projectId, {
      status: "archived",
    });
  }
}
