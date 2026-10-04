# Testing

## Testing Strategy

Prowo AI should be tested at multiple levels:

```text
Unit Tests
   ↓
Subsystem Tests
   ↓
Integration Tests
   ↓
End-to-End Tests
```

## Unit Tests

Validate individual services, managers, policies, parsers, state machines, and utilities.

## Integration Tests

Validate interactions between components such as:

- Orchestrator routing
- Orchestration persistence
- API and authentication
- Scheduler and queue
- Agent gateway
- Lifecycle and recovery
- Security authorization

## End-to-End Tests

End-to-end tests should validate complete user journeys, for example:

```text
User Request
 → API
 → Authentication
 → Orchestration
 → Planning
 → Approval
 → Execution
 → Result
```

Connected-device flows should additionally validate:

```text
Task
 → Scheduling
 → Device Allocation
 → Agent Gateway
 → Agent
 → Execution
 → Result
```

## Test Requirements

Before merging a significant change:

- Type-check the affected code.
- Run targeted tests.
- Run broader integration tests when shared interfaces change.
- Verify failure and authorization paths.
- Avoid tests that only confirm placeholders without validating meaningful behavior.

## Production Readiness

A green unit-test suite alone does not establish production readiness. Real transports, execution adapters, persistence, security configuration, and deployment infrastructure must also be validated.
