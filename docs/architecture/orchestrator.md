# Orchestrator

## Role

The orchestrator is the central coordination layer of Prowo AI.

It receives a high-level user request, determines what needs to happen, builds an execution plan, routes work to the appropriate executor, and coordinates approvals and results.

## Core Flow

```text
Request
  ↓
Orchestrator Service
  ↓
Task Router
  ↓
Execution Planner
  ↓
Approval Gate
  ↓
Target Executor
  ↓
Result
```

## Responsibilities

- Interpret the requested task kind.
- Build execution plans.
- Route work to local, code, workflow, tool, or connected-device executors.
- Coordinate approval requirements.
- Track execution state.
- Return structured results.
- Integrate with persistence and service layers.

## Execution Targets

The current orchestration architecture defines executor boundaries for:

- Local execution
- Connected devices
- Workflows
- Code/program execution
- Tools

## Key Components

`core/orchestrator` contains the runtime, routing, planning, executor, integration, composition, approval, and test layers.

## Security Model

The orchestrator does not treat every requested operation as automatically executable. Sensitive actions can pass through permission and approval controls before execution.

## Design Goal

The orchestrator should remain independent of any single model provider or execution environment. AI models decide and plan; controlled execution components perform the work.
