
# Ghost-Hunter CLI Prototype

Welcome to the Ghost-Hunter Proof of Concept. This repo demonstrates an enterprise cloud retirement workflow managed by automated agents and strict governance policies.

## What to open first
1. **App.tsx**: View the "Ghost-Hunter Command Center" where you can simulate flows.
2. **src/negotiate.ts**: Review the core logic for Prod vs Non-Prod governance.
3. **src/execute.ts**: See the "Snapshot-First" safety gate logic.

## How to run
This is a React-based simulation dashboard of the Node.js logic. 
- The UI allows you to edit the "Event JSON" (Cloud Resource Metadata).
- You can toggle `DRY_RUN` and `Simulate Fail` (to test the snapshot safety gate).
- Click **Execute Agent Flow** to see the canonical output and audit logs.

## Example Scenarios
1. **Non-Prod Silent Success**: Use `env: "non-prod"` and leave `Simulated Owner Action` as default. Decision should be `PROCEED` (Silent Approval).
2. **Prod Silent Escalation**: Use `env: "prod"` and leave `Simulated Owner Action` as default. Decision should be `ESCALATE`.
3. **Snapshot Failure**: Toggle `Simulate Fail`. The agent will abort retirement and change decision to `DEFER`.
4. **Change Freeze**: Set `context.freezeWindow: true` in the JSON. The agent will immediately `DEFER`.

## Architecture Mapping
- **Triage Agent**: `src/triage.ts` (Guardrail checking).
- **Validation Agent**: `src/validate.ts` (Zod contract enforcement).
- **Negotiation Agent**: `src/negotiate.ts` (Human-in-the-loop logic).
- **Execution Agent**: `src/execute.ts` (Snapshot -> Retire logic).
- **Audit Logs**: `src/audit.ts` (Append-only storage).
