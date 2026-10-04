# PROWO AI

### The AI Operating System for Programs, Workflows & Connected Computers

**Build. Automate. Execute. Orchestrate.**

Prowo AI is being engineered as a full-stack AI orchestration platform that turns natural-language instructions into planned, permission-aware, executable work.

Instead of treating AI as only a chat interface, Prowo is designed to sit between the user and the systems that perform the work: programs, workflows, files, tools, APIs, and connected computers.

> **Status:** Active development — architecture and integration work in progress.

---

## What is Prowo AI?

Prowo AI is designed to understand a user's objective, plan the required work, select an execution target, obtain approval when necessary, execute through the appropriate subsystem, and return the result.

A high-level request can eventually follow a path such as:

```text
User
  ↓
Prowo Web / Desktop
  ↓
API
  ↓
Authentication
  ↓
Orchestrator
  ↓
Router → Planner → Policy / Approval
  ↓
Execution Target
  ├── Local Execution
  ├── Code Generation
  ├── Workflow Engine
  ├── External Tools
  └── Connected Computers
          ↓
      Prowo Agent
  ↓
Result / Logs / State
```

The architecture is intentionally modular so that individual engines can evolve without forcing the entire platform into one implementation.

---

# Core Vision

Prowo is being built around a simple idea:

> **Describe what you want done. Prowo plans how it should be done, determines where it should run, applies the required security controls, executes it, and reports the result.**

Examples of the intended direction include:

- Build a program from a natural-language request.
- Create and execute a repeatable workflow.
- Process files and documents.
- Connect external tools and APIs.
- Dispatch work to another connected computer.
- Coordinate multiple execution devices.
- Maintain project context and memory.
- Require human approval for sensitive operations.
- Track execution, failures, retries, and results.

---

# Architecture

```text
                              ┌─────────────────────┐
                              │       USER          │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   WEB / DESKTOP      │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │        API           │
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │            AUTHENTICATION               │
                    └────────────────────┬────────────────────┘
                                         │
                    ┌────────────────────▼────────────────────┐
                    │             ORCHESTRATOR                │
                    │                                         │
                    │  Router → Planner → Runtime → Results  │
                    └───────────────┬─────────────────────────┘
                                    │
                ┌───────────────────┼────────────────────┐
                │                   │                    │
        ┌───────▼───────┐   ┌──────▼──────┐    ┌───────▼────────┐
        │   PERMISSIONS │   │   APPROVAL   │    │     MEMORY     │
        │   & SECURITY  │   │    GATE      │    │    & CONTEXT   │
        └───────┬───────┘   └──────┬──────┘    └───────┬────────┘
                │                   │                    │
                └───────────────────┼────────────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │  TARGET EXECUTORS   │
                         └──────────┬──────────┘
                                    │
          ┌─────────────┬───────────┼───────────┬──────────────┐
          │             │           │           │              │
     ┌────▼────┐   ┌────▼────┐ ┌────▼────┐ ┌───▼──────┐ ┌────▼─────┐
     │  Local  │   │  Code   │ │Workflow │ │  Tools   │ │ Devices  │
     │ Engine  │   │ Engine  │ │ Engine  │ │ / APIs   │ │ / Agents │
     └─────────┘   └─────────┘ └─────────┘ └──────────┘ └────┬─────┘
                                                              │
                                                       ┌──────▼──────┐
                                                       │ Prowo Agent │
                                                       └─────────────┘
```

---

# Major Subsystems

## Orchestrator

The orchestration layer is the central decision and execution coordinator.

It contains:

- Request routing
- Execution planning
- Runtime execution
- Target executor registry
- Approval gates
- Orchestration services
- Composition and factory layers
- Integration tests

Supported execution targets currently include:

```text
local
connected_device
workflow
code_generation
external_tool
```

---

## AI Layer

The AI layer is designed to separate model selection from the rest of the platform.

Current architectural components include:

- AI Planner
- Model Router
- Provider adapters
- Provider registry
- Prompt infrastructure

The model router is designed to allow different model providers to be used without coupling the rest of Prowo directly to one provider.

---

## Code Engine

The Code Engine provides the architectural boundary for:

- Project manifests
- Code files
- Code generation
- Validation
- Project-level operations

The intention is for generated programs to become real project artifacts rather than isolated text responses.

---

## Workflow Engine

The Workflow Engine provides a structured automation layer.

Supported workflow concepts include:

- Manual triggers
- Scheduled triggers
- Event triggers
- Webhooks
- File-change triggers

Workflow actions include concepts such as:

- Program execution
- File operations
- API requests
- Document processing
- Computer tasks
- Conditions
- Notifications

---

## Execution Engine

Execution is separated from planning.

The execution architecture includes:

- Sandbox policies
- Process management
- Execution requests
- Execution logs
- Execution results
- Validation before execution

Sensitive execution is intended to remain behind Prowo's permission and approval systems.

---

# Computer Network

One of Prowo's major architectural goals is the ability to use **connected computers as execution resources**.

The computer-network subsystem includes architectural layers for:

- Device registration
- Agent authentication
- Transport
- Agent protocol
- Command routing
- Agent gateway
- Secure gateway
- Capability negotiation
- Capability discovery
- Resource monitoring
- Device selection
- Distributed scheduling
- Distributed queues
- Task lifecycle
- Task coordination
- Task recovery
- Network orchestration
- Health monitoring
- Network security
- Observability
- Integration testing

The intended model is:

```text
Prowo
  ↓
Task Requirements
  ↓
Device Selection
  ↓
Scheduler
  ↓
Agent Gateway
  ↓
Connected Device
  ↓
Execution
  ↓
Result
```

---

# Prowo Agents

Agents are the execution-side component installed on connected computers.

The agent architecture includes:

- Agent identity
- Agent configuration
- Agent runtime
- Agent client
- Agent transport
- Task handling
- Local task execution boundary
- Health monitoring
- Bootstrap lifecycle
- Approval-aware execution

The security principle is important:

```text
Incoming Task
     ↓
Authentication
     ↓
Capability / Policy Checks
     ↓
Approval Check
     ↓
Local Execution Boundary
     ↓
Result
```

The agent should not become an unrestricted remote shell. Execution is intended to remain controlled by Prowo's security and execution architecture.

---

# Security

Security is designed as a first-class subsystem rather than an afterthought.

Architectural security controls include:

- Authentication
- Sessions
- Permissions
- Policy evaluation
- Approval management
- Audit logs
- Agent authentication
- Device trust
- Network security
- Capability checks
- Sandboxed execution

A sensitive operation should be able to follow:

```text
Request
  ↓
Identity
  ↓
Permission Policy
  ↓
Risk Assessment
  ↓
Approval Gate
  ↓
Execution
  ↓
Audit
```

---

# Memory & Context

Prowo includes a dedicated memory architecture intended to maintain useful context across tasks and projects.

The memory subsystem includes:

- Memory records
- Memory storage
- Retrieval
- Context management
- Context bundles

The goal is to allow Prowo to work on longer-running projects without treating every request as an isolated conversation.

---

# Tools & Integrations

Prowo separates tools from the orchestration engine.

The tool architecture includes:

- Tool definitions
- Tool registry
- Tool validation
- Tool execution
- Risk classification
- Approval-aware execution

The integration architecture provides a boundary for external services and APIs.

This is intended to let Prowo grow into an ecosystem of tools without hard-coding every integration into the core orchestrator.

---

# Services

The service layer currently contains architectural foundations for:

```text
services/
├── api/
├── authentication/
├── orchestration/
├── database/
├── realtime/
├── queue/
├── projects/
├── tasks/
├── notifications/
├── billing/
└── bootstrap/
```

These services provide boundaries for application-level concerns such as:

- API routing
- Authentication
- Persistent orchestration
- Database access
- Realtime events
- Background jobs
- Projects
- Tasks
- Notifications
- Credits and usage
- Application lifecycle

---

# Application Architecture

The intended application composition is:

```text
Prowo Application
       │
       ├── Web
       ├── Desktop
       ├── API
       ├── Authentication
       ├── Orchestration
       ├── Database
       ├── Realtime
       ├── Queue
       └── Agents
```

The application/bootstrap layers are responsible for assembling these subsystems rather than embedding construction logic throughout the codebase.

---

# Repository Structure

The repository is organized around major platform responsibilities:

```text
PROWO/
├── apps/
│   ├── web/
│   ├── desktop/
│   └── agents/
│
├── core/
│   ├── orchestrator/
│   ├── workflow-engine/
│   ├── code-engine/
│   ├── execution-engine/
│   ├── computer-network/
│   ├── file-engine/
│   ├── permissions/
│   ├── memory/
│   ├── tool-system/
│   └── integrations/
│
├── ai/
│   ├── planner/
│   ├── agents/
│   ├── model-router/
│   └── prompts/
│
├── services/
│   ├── api/
│   ├── authentication/
│   ├── orchestration/
│   ├── database/
│   ├── realtime/
│   ├── queue/
│   ├── projects/
│   ├── tasks/
│   ├── notifications/
│   ├── billing/
│   └── bootstrap/
│
├── packages/
│   ├── shared/
│   ├── types/
│   └── sdk/
│
├── infrastructure/
│   ├── docker/
│   ├── deployment/
│   └── security/
│
└── application/
```

---

# End-to-End Request Model

A future Prowo request can conceptually move through:

```text
1. User describes an objective
2. API authenticates the request
3. Orchestrator receives the task
4. Router determines the execution target
5. Planner creates an execution plan
6. Permissions evaluate required actions
7. Approval is requested when required
8. Scheduler selects an execution resource when needed
9. Executor invokes the appropriate engine
10. Agent executes remotely when required
11. Logs and state are recorded
12. Result is returned to the user
```

This architecture allows Prowo to evolve from a simple AI interface into an orchestration platform.

---

# Development Status

### Architecture

- [x] Core repository architecture
- [x] Web application foundation
- [x] Orchestrator foundation
- [x] AI model routing foundation
- [x] AI planner foundation
- [x] Code Engine foundation
- [x] Workflow Engine foundation
- [x] Execution Engine foundation
- [x] File Engine foundation
- [x] Permissions foundation
- [x] Memory foundation
- [x] Tool system foundation
- [x] Authentication foundation
- [x] Database abstraction
- [x] API foundation
- [x] Realtime foundation
- [x] Queue foundation
- [x] Project and task services
- [x] Notification and billing foundations

### Computer Network

- [x] Device management
- [x] Agent registry
- [x] Agent transport architecture
- [x] Agent protocol
- [x] Command routing
- [x] Agent gateway
- [x] Agent authentication
- [x] Secure gateway
- [x] Capability negotiation
- [x] Capability discovery
- [x] Resource monitoring
- [x] Device selection
- [x] Distributed scheduling
- [x] Distributed queue
- [x] Task lifecycle
- [x] Task coordination
- [x] Task recovery
- [x] Network orchestration
- [x] Health monitoring
- [x] Network security
- [x] Observability

### Application Integration

- [x] Orchestration service
- [x] Orchestration API
- [x] Authentication-aware API boundary
- [x] Orchestration persistence boundary
- [x] Backend bootstrap
- [x] API lifecycle boundary
- [x] Application assembly
- [x] Web API client foundation
- [x] Agent runtime foundation

### Next Engineering Phase

- [ ] Full repository type-check
- [ ] Resolve integration/type conflicts
- [ ] Connect production database adapter
- [ ] Connect real HTTP server
- [ ] Connect production authentication
- [ ] Connect real model providers
- [ ] Connect production execution adapters
- [ ] Connect Web UI prompt flow
- [ ] End-to-end orchestration execution
- [ ] Production deployment
- [ ] Security hardening
- [ ] Performance/load testing

---

# Design Principles

### Modular by default

Major capabilities are isolated behind interfaces and adapters.

### Security before execution

Execution should pass through authentication, permissions, approval, and execution boundaries.

### AI is an orchestrator, not the operating system

Models make decisions and produce plans; deterministic services and execution engines perform controlled operations.

### Connected computers are execution resources

Agents extend Prowo's execution environment without requiring the core platform to run directly on every machine.

### Persistent projects

Programs, workflows, files, tasks, memory, and execution history are intended to become durable project artifacts.

### Replaceable infrastructure

Model providers, databases, transports, execution environments, and integrations should be replaceable without rewriting the orchestrator.

---

# Current Status

Prowo AI is an **active engineering project**.

The repository currently contains a broad architectural foundation and integration layers. Some components are intentionally represented as interfaces, adapters, mocks, or placeholders while production implementations are being connected and tested.

The immediate engineering priority is **integration and execution correctness**, not adding more architectural abstractions.

---

# License

License information will be added as the project's distribution model is finalized.

---

## PROWO AI

**Build. Automate. Execute. Orchestrate.**
