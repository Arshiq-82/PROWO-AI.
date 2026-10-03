import {
  CodeGenerationRequest,
  CodeGenerationResult,
  ProjectManifest,
} from "./types";
import { createProjectManifest } from "./project";

function createProjectName(objective: string): string {
  const words = objective
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  return words.length > 0
    ? words.join("-").toLowerCase().replace(/[^a-z0-9-]/g, "")
    : "prowo-project";
}

export class CodeEngine {
  async generate(
    request: CodeGenerationRequest
  ): Promise<CodeGenerationResult> {
    const projectId =
      request.projectId ?? `project_${Date.now()}`;

    const name = createProjectName(request.objective);

    const project: ProjectManifest = createProjectManifest({
      id: projectId,
      name,
      description: request.objective,
      language: request.language,
      files: request.existingFiles,
    });

    return {
      project,
      warnings: [
        "Code generation provider is not connected yet.",
        "The project manifest is ready for the AI generation pipeline.",
      ],
    };
  }
}
