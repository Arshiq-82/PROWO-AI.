export type ProjectStatus = "active" | "archived" | "deleted";

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface CreateProjectInput {
  id: string;
  userId: string;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  metadata?: Record<string, unknown>;
}
