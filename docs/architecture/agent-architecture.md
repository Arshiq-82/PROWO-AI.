# Agent Architecture

## Purpose

Prowo Agents provide a controlled runtime on connected computers.

An agent receives authorized tasks from the Prowo backend, validates execution requirements, delegates approved work, and reports results and health.

## Architecture

```text
Backend
  ↓
Agent Gateway
  ↓
Agent Transport
  ↓
Agent Runtime
  ↓
Task Handler
  ↓
Approval / Security
  ↓
Agent Task Executor
  ↓
Local Execution
```

## Agent Responsibilities

- Register with Prowo.
- Maintain an authenticated connection.
- Send heartbeats.
- Report health and status.
- Receive task commands.
- Validate task authorization.
- Execute approved tasks through controlled execution boundaries.
- Return task results and events.

## Agent Components

The agent application contains configuration, transport, task execution, health, bootstrap, and integration-test layers.

## Security Principle

An agent should not become an unrestricted remote shell. Local work must pass through the platform's authorization, approval, and execution controls.

## Future Deployment

The agent architecture is intended to support multiple computers and execution environments while keeping the backend independent from machine-specific implementation details.
