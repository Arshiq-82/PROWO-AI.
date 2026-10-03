import {
  CodeFile,
  ProjectManifest,
  SourceLanguage,
} from "./types";

export function createProjectManifest(input: {
  id: string;
  name: string;
  description: string;
  language: SourceLanguage;
  files?: CodeFile[];
}): ProjectManifest {
  const now = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    language: input.language,
    files: input.files ?? [],
    dependencies: [],
    scripts: {},
    createdAt: now,
    updatedAt: now,
  };
}

export function addFile(
  project: ProjectManifest,
  file: CodeFile
): ProjectManifest {
  const existingIndex = project.files.findIndex(
    (current) => current.path === file.path
  );

  const files = [...project.files];

  if (existingIndex >= 0) {
    files[existingIndex] = file;
  } else {
    files.push(file);
  }

  return {
    ...project,
    files,
    updatedAt: new Date().toISOString(),
  };
}

export function removeFile(
  project: ProjectManifest,
  filePath: string
): ProjectManifest {
  return {
    ...project,
    files: project.files.filter((file) => file.path !== filePath),
    updatedAt: new Date().toISOString(),
  };
}
