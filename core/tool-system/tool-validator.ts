import { ToolDefinition, ToolInputSchema } from "./types";

export interface ToolValidationResult {
  valid: boolean;
  errors: string[];
}

export class ToolValidator {
  validateDefinition(definition: ToolDefinition): ToolValidationResult {
    const errors: string[] = [];

    if (!definition.id.trim()) {
      errors.push("Tool id is required.");
    }

    if (!definition.name.trim()) {
      errors.push("Tool name is required.");
    }

    if (!definition.description.trim()) {
      errors.push("Tool description is required.");
    }

    if (!definition.inputSchema) {
      errors.push("Tool input schema is required.");
    } else {
      errors.push(...this.validateSchema(definition.inputSchema));
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateInput(
    schema: ToolInputSchema,
    input: Record<string, unknown>
  ): ToolValidationResult {
    const errors: string[] = [];

    if (schema.type !== "object") {
      errors.push("Tool input schema must use object type.");
    }

    for (const requiredField of schema.required ?? []) {
      if (!(requiredField in input)) {
        errors.push(`Missing required input: "${requiredField}".`);
      }
    }

    if (schema.additionalProperties === false) {
      for (const key of Object.keys(input)) {
        if (!(key in schema.properties)) {
          errors.push(`Unexpected input property: "${key}".`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateSchema(schema: ToolInputSchema): string[] {
    const errors: string[] = [];

    if (schema.type !== "object") {
      errors.push("Tool input schema type must be object.");
    }

    if (!schema.properties || typeof schema.properties !== "object") {
      errors.push("Tool input schema properties are required.");
    }

    return errors;
  }
}
