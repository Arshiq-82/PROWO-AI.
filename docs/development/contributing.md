# Contributing

## Engineering Principles

Prowo AI is intended to be developed as a modular platform.

Contributions should:

- Keep subsystem boundaries clear.
- Prefer typed interfaces.
- Avoid unnecessary coupling.
- Preserve security boundaries.
- Add tests for meaningful behavior.
- Keep public APIs intentional.
- Document architectural decisions when they affect multiple subsystems.

## Change Workflow

1. Identify the owning subsystem.
2. Understand its interfaces and dependencies.
3. Implement the smallest coherent change.
4. Add or update tests.
5. Type-check the affected package.
6. Run relevant integration tests.
7. Review security and failure paths.
8. Update documentation when behavior or architecture changes.

## Naming and Structure

Follow the existing TypeScript naming conventions and directory organization.

Avoid creating duplicate foundational types when an existing shared type already represents the concept.

## Pull Requests

A good change should explain:

- What changed
- Why it changed
- Which components are affected
- How it was tested
- Any remaining limitations or follow-up work
