
import { validateInput } from './validate';
import { triage } from './triage';
import { negotiate } from './negotiate';
import { generateChangePayload } from './change_control';
import { executePlan } from './execute';
import { auditLog } from './audit';
import { GhostHunterInput, GhostHunterOutput } from './types';

export async function runGhostHunterSimulation(
  rawInput: any, 
  options: { 
    dryRun: boolean, 
    ownerAction?: string, 
    simulateSnapshotFail?: boolean 
  }
): Promise<GhostHunterOutput> {
  const requestId = `req-${Math.random().toString(36).substring(7)}`;
  
  // 1. Validate
  const input = validateInput(rawInput);
  
  // 2. Triage
  const triageResult = triage(input);
  if (!triageResult.canProceed) {
    const result: GhostHunterOutput = {
      decision: "DEFER",
      reason: triageResult.reason,
      communications: [],
      tickets: [],
      scheduled_operations: [],
      audit: { signals: triageResult.signals, policyVersion: "GH-1.0", initiator: "Ghost-Hunter", requestId },
      savings: { estimatedMonthlyUSD: 0 }
    };
    auditLog.log({ requestId, inputHash: "...", decision: result.decision, result });
    return result;
  }

  // 3. Negotiate (Human in the loop logic)
  const negotiation = negotiate(input, options.ownerAction);
  
  // 4. Change Control
  const change = generateChangePayload(input, negotiation.decision);

  // 5. Execution
  let executionLogs: string[] = [];
  let finalDecision = negotiation.decision;
  
  if (negotiation.decision === 'PROCEED') {
    const exec = await executePlan(input, options.dryRun, options.simulateSnapshotFail);
    executionLogs = exec.logs;
    if (exec.finalDecisionOverride) {
      finalDecision = exec.finalDecisionOverride;
    }
  }

  const result: GhostHunterOutput = {
    decision: finalDecision,
    reason: negotiation.reason,
    communications: [{
      channel: "Teams",
      to: input.tags.owner,
      message: `Resource ${input.resourceId} is scheduled for retirement.`,
      buttons: ["PROCEED", "DEFER_30", "KEEP"]
    }],
    tickets: [change as any],
    scheduled_operations: finalDecision === 'PROCEED' ? [
      { action: "snapshot", when: "immediate", details: { resource: input.resourceId } },
      { action: "retire", when: "post-snapshot-verify", details: { resource: input.resourceId } }
    ] : [],
    audit: { 
      signals: [...triageResult.signals, `ACTION_${finalDecision}`], 
      policyVersion: "GH-1.0", 
      initiator: "Ghost-Hunter", 
      requestId 
    },
    savings: { estimatedMonthlyUSD: finalDecision === 'PROCEED' ? input.monthlyCost : 0 }
  };

  auditLog.log({ 
    requestId, 
    inputHash: "...", 
    decision: finalDecision, 
    executionLogs,
    isDryRun: options.dryRun 
  });

  return result;
}
