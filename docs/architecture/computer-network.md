# Computer Network Architecture

## Purpose

Prowo AI can coordinate tasks across connected computers through the computer-network subsystem.

```text
Prowo Backend
      ↓
Network Orchestrator
      ↓
Scheduler / Queue
      ↓
Device Selection
      ↓
Agent Gateway
      ↓
Transport
      ↓
Agent
      ↓
Connected Computer
```

## Major Components

### Device Management

Tracks registered devices, status, capabilities, and heartbeats.

### Capability System

Devices can expose system, hardware, runtime, browser, filesystem, network, software, security, and custom capabilities.

### Resource Monitoring

The network can consider CPU, memory, storage, GPU, processes, uptime, and other resource information when selecting execution targets.

### Scheduling

The distributed scheduler selects suitable devices according to task requirements, priority, capacity, resource availability, capabilities, and security.

### Queue

The distributed queue provides priority ordering, leasing, retries, dispatching, completion, failure handling, and cancellation.

### Lifecycle

Tasks move through lifecycle states such as:

`Created → Queued → Planning → Scheduled → Allocated → Dispatched → Running → Completed`

Failure and cancellation paths are also represented.

### Recovery

Recovery components classify failures, retry tasks, apply backoff, and support device failover/reallocation.

### Health

Heartbeat and health-monitoring components track device availability and responsiveness.

## Security

Network access is controlled through agent authentication, secure gateway checks, device trust, permissions, and approval policies.

## Transport

The transport layer defines a message protocol and WebSocket-compatible adapter boundary. Concrete deployment transport should be validated as part of integration testing.

## Observability

Network logs, metrics, health reports, warnings, and lifecycle events provide visibility into distributed execution.
