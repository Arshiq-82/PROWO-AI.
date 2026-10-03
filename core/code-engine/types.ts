export type SourceLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "php"
  | "html"
  | "css"
  | "sql"
  | "json"
  | "markdown"
  | "text";

export interface CodeFile {
  path: string;
  content: string;
  language: SourceLanguage;
  executable?: boolean;
}

export interface ProjectManifest {
  id: string;
  name: string;
  description: string;
  language: SourceLanguage;
  entryPoint?: string;
  files: CodeFile[];
  dependencies: string[];
  scripts: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CodeGenerationRequest {
  projectId?: string;
  objective: string;
  language: SourceLanguage;
  existingFiles?: CodeFile[];
  constraints?: string[];
}

export interface CodeGenerationResult {
  project: ProjectManifest;
  warnings: string[];
}

export interface CodeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
