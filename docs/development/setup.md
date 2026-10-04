# Development Setup

## Prerequisites

The repository is TypeScript-oriented and currently uses a modular application/core/services structure.

Recommended development environment:

- Node.js LTS
- npm or the repository's selected package manager
- Git
- TypeScript-compatible IDE

## Repository

```text
PROWO/
├── apps/
├── core/
├── ai/
├── services/
├── packages/
└── infrastructure/
```

## Getting Started

1. Clone the private repository.
2. Install dependencies for the relevant application/package.
3. Configure environment variables required by the selected services.
4. Run the applicable development server or test command.
5. Validate the affected subsystem before integrating changes.

## Environment Configuration

Provider credentials, database configuration, authentication secrets, transport configuration, and other deployment values should be supplied through environment configuration rather than committed to source control.

## Development Principle

Do not assume an architectural placeholder is a production implementation. Validate concrete adapters, integrations, execution behavior, and end-to-end flows before relying on them.
