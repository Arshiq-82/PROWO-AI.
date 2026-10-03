import {
  CodeValidationResult,
  ProjectManifest,
} from "./types";

const unsafePathPatterns = [
  /^\/+/,
  /^[A-Za-z]:[\\/]/,
  /\.\.[\\/]/,
];

export function validateProject(
  project: ProjectManifest
): CodeValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!project.id.trim()) {
    errors.push("Project ID is required.");
  }

  if (!project.name.trim()) {
    errors.push("Project name is required.");
  }

  if (project.files.length === 0) {
    warnings.push("Project currently contains no source files.");
  }

  const paths = new Set<string>();

  for (const file of project.files) {
    if (!file.path.trim()) {
      errors.push("A project file has an empty path.");
      continue;
    }

    if (paths.has(file.path)) {
      errors.push(`Duplicate project file: ${file.path}`);
    }

    paths.add(file.path);

    if (unsafePathPatterns.some((pattern) => pattern.test(file.path))) {
      errors.push(`Unsafe file path: ${file.path}`);
    }

    if (file.content.length > 5_000_000) {
      warnings.push(`Large source file detected: ${file.path}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
