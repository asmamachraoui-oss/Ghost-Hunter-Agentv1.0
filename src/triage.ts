
import { GhostHunterInput } from './types';

export interface TriageResult {
  canProceed: boolean;
  reason: string;
  signals: string[];
}

export function triage(input: GhostHunterInput): TriageResult {
  const signals: string[] = [];
  
  if (input.context.activeIncident) {
    return { canProceed: false, reason: "DEFER: Active incident detected in environment.", signals: ["INCIDENT_GUARDRAIL"] };
  }
  
  if (input.context.freezeWindow) {
    return { canProceed: false, reason: "DEFER: Change freeze window is active.", signals: ["FREEZE_WINDOW_GUARDRAIL"] };
  }

  if (input.context.releaseWindow) {
    return { canProceed: false, reason: "DEFER: High-priority release window active.", signals: ["RELEASE_WINDOW_GUARDRAIL"] };
  }

  signals.push("GUARDRAILS_CLEAR");
  return { canProceed: true, reason: "Guardrails cleared, ready for validation.", signals };
}
