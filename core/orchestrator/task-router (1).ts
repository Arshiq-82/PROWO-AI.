import {
  ExecutionTarget,
  OrchestratorRoute,
  OrchestratorTaskRequest,
} from "./types";

export class OrchestratorTaskRouter {
  route(request: OrchestratorTaskRequest): OrchestratorRoute {
    if (request.target) {
      return {
        target: request.target,
        reason: "Execution target was explicitly requested.",
        confidence: 1,
      };
    }

    const prompt = request.prompt.toLowerCase();

    if (
      prompt.includes("computer") ||
      prompt.includes("remote machine") ||
      prompt.includes("connected device") ||
      prompt.includes("run on my pc")
    ) {
      return {
        target: "connected_device",
        reason: "Request requires a connected computer.",
        confidence: 0.95,
      };
    }

    if (
      prompt.includes("workflow") ||
      prompt.includes("automate") ||
      prompt.includes("every day") ||
      prompt.includes("schedule")
    ) {
      return {
        target: "workflow",
        reason: "Request appears to require workflow automation.",
        confidence: 0.9,
      };
    }

    if (
      prompt.includes("create a program") ||
      prompt.includes("write code") ||
      prompt.includes("build an app") ||
      prompt.includes("generate code")
    ) {
      return {
        target: "code_generation",
        reason: "Request requires program or code generation.",
        confidence: 0.9,
      };
    }

    if (
      prompt.includes("api") ||
      prompt.includes("send email") ||
      prompt.includes("external service") ||
      prompt.includes("search")
    ) {
      return {
        target: "external_tool",
        reason: "Request appears to require an external tool or service.",
        confidence: 0.8,
      };
    }

    return {
      target: "local",
      reason: "Request can begin with local Prowo orchestration.",
      confidence: 0.7,
    };
  }
}
