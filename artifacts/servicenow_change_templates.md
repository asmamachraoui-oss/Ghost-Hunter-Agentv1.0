
# Ghost-Hunter ServiceNow Change Templates

## Template A: Standard Change (Non-Prod)
- **Category:** Cloud Optimization
- **Risk:** Low
- **State:** Pre-approved
- **Assignment Group:** Cloud Ops
- **Implementation:** Automated via Ghost-Hunter
- **Verification:** Snapshot integrity check post-creation.

## Template B: Normal Change (Prod)
- **Category:** Service Decommissioning
- **Risk:** Moderate
- **CAB Approval:** Required
- **Owner Approval:** Required (Mandatory)
- **Outage:** Not expected (assuming idle state validation)
- **Backout Plan:** Restore from snapshot created at T-0.
