# Prowo AI — System Architecture

## Purpose

Prowo AI is designed as an AI orchestration platform for programs, workflows, tools, files, and connected computers.

The architecture separates planning, orchestration, execution, networking, security, persistence, and presentation so each subsystem can evolve independently.

## High-Level Architecture

```text
User
  ↓
Web / Desktop
  ↓
API & Authentication
  ↓
Orchestration Service
  ↓
AI Planner / Model Router
  ↓
Task Router
  ├── Code Engine
  ├── Workflow Engine
  ├── Tool System
  ├── Local Execution
  └── Connected Computer Network
          ↓
       Agent Gateway
          ↓
        Agents
          ↓
   User Computers / Devices
```

## Major Layers

### Applications

- `apps/web` — web interface
- `apps/desktop` — desktop shell and local bridge
- `apps/agents` — connected-device agent runtime

### Core

- `core/orchestrator` — request planning and execution routing
- `core/workflow-engine` — workflow definition and execution
- `core/code-engine` — program/project generation and validation
- `core/execution-engine` — controlled execution and sandbox policy
- `core/computer-network` — distributed computer coordination
- `core/file-engine` — files, projects, and versions
- `core/tool-system` — registered tools and controlled tool execution
- `core/permissions` — authorization, approvals, and audit
- `core/memory` — persistent/contextual memory

### AI

- `ai/planner` — task planning
- `ai/agents` — future specialized agents
- `ai/model-router` — model/provider routing
- `ai/prompts` — prompt definitions

### Services

Services provide application-facing infrastructure for API access, authentication, database persistence, realtime events, queues, projects, tasks, notifications, billing, and integrations.

## Request Lifecycle

1. A user submits a request.
2. Authentication establishes the caller identity.
3. The orchestration layer creates an orchestration request.
4. The planner determines the task kind and execution steps.
5. The task router selects the appropriate executor.
6. Permissions and approval gates are evaluated.
7. The selected engine or connected device executes the approved work.
8. Results, logs, state, and events are persisted or streamed.
9. The API/frontend receives the current task state and result.

## Design Principles

- Explicit boundaries between subsystems.
- Security before execution.
- Approval for sensitive operations.
- Versioned state where recovery matters.
- Observable execution.
- Replaceable model providers and execution adapters.
- Connected devices treated as controlled execution targets.

## Current Implementation Note

The repository contains architectural foundations for these layers. Concrete production adapters, infrastructure configuration, and full end-to-end execution should be validated before describing the platform as production-ready.
