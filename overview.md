# API Overview

## Purpose

The Prowo API exposes application capabilities to clients such as the web application, desktop application, and future external integrations.

The current architecture separates API routing, request handling, authentication, orchestration, and service composition.

## API Structure

```text
Client
  ↓
API Runtime
  ↓
Authentication
  ↓
Authenticated Request
  ↓
API Controller
  ↓
Application Service
  ↓
Core Systems
```

## Orchestration Endpoints

The current orchestration API defines:

### Create Orchestration

`POST /api/v1/orchestrations`

Creates an orchestration request from the authenticated caller.

### Execute Orchestration

`POST /api/v1/orchestrations/:requestId/execute`

Executes an existing orchestration request through the orchestration runtime.

## Authentication

Authenticated API flows should derive caller identity from the authentication layer rather than trusting a user identifier supplied by the client.

## Request Lifecycle

```text
HTTP Request
 → Authentication
 → Route
 → Controller
 → Service
 → Orchestrator
 → Result
```

## API Design Principles

- Version API routes.
- Authenticate before protected operations.
- Validate request input.
- Keep controllers thin.
- Keep business logic in services/core layers.
- Return structured results and errors.
- Do not expose internal implementation details unnecessarily.

## Current Status

The repository contains the API and orchestration integration foundations. Concrete server transport, deployment configuration, persistence adapters, and production authentication must be validated as part of end-to-end integration.

## Future API Areas

The API architecture can expand to expose:

- Projects
- Tasks
- Workflows
- Programs
- Files
- Connected devices
- Tools
- Memory
- Notifications
- Usage and billing
- Integrations
