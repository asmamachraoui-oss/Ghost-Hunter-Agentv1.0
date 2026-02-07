# Ghost-Hunter Agent (MVP)

Welcome to the Ghost-Hunter Agent prototype. This repository demonstrates a governed, end-to-end cloud resource retirement workflow using automated agents with human-in-the-loop controls and safety guardrails.

## What to open first
1. **SYSTEM_PROMPT.md**: Core Ghost-Hunter agent rules, governance boundaries, and failure behavior.
2. **src/negotiate.ts**: Human-in-the-loop logic for Prod vs Non-Prod decisions.
3. **src/execute.ts**: Snapshot-first safety gate and gated execution logic.
4. **App.tsx**: Optional UI used to simulate agent flows and scenarios.

## How it works
This project includes a lightweight simulation interface to demonstrate the Ghost-Hunter Agent behavior.
- Cloud resource metadata is provided as Event JSON.
- The agent evaluates governance rules and safety signals.
- Human approval is simulated based on environment and owner response.
- Execution is always snapshot-first and gated by approvals.
- All decisions and actions are written to audit logs.

## Example Scenarios
1. **Non-Prod Silent Success**: Use `env: "non-prod"` and leave owner action empty. Decision should be `PROCEED` after silent approval.
2. **Prod Silent Escalation**: Use `env: "prod"` with no owner response. Decision should be `ESCALATE` (no execution).
3. **Snapshot Failure**: Enable snapshot failure simulation. The agent aborts retirement and returns `DEFER`.
4. **Change Freeze**: Set `context.freezeWindow: true`. The agent immediately defers and takes no action.

## Architecture Mapping
- **Triage Agent**: `src/triage.ts` (resource filtering and context checks)
- **Validation Agent**: `src/validate.ts` (policy and contract enforcement)
- **Negotiation Agent**: `src/negotiate.ts` (human-in-the-loop logic)
- **Execution Agent**: `src/execute.ts` (snapshot → verify → retire workflow)
- **Audit Logs**: `src/audit.ts` (append-only decision and action logging)
