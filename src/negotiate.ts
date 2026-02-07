
import { GhostHunterInput } from './types';

export interface NegotiationResult {
  decision: "PROCEED" | "DEFER" | "ESCALATE" | "NO-ACTION";
  reason: string;
}

export function negotiate(input: GhostHunterInput, ownerAction?: string): NegotiationResult {
  // If owner took explicit action
  if (ownerAction === 'KEEP') {
    return { decision: "NO-ACTION", reason: "Owner requested to keep resource." };
  }
  if (ownerAction === 'DEFER_30') {
    return { decision: "DEFER", reason: "Owner deferred action for 30 days." };
  }
  if (ownerAction === 'PROCEED') {
    return { decision: "PROCEED", reason: "Owner explicitly approved retirement." };
  }

  // If no action (Silence)
  if (input.env === 'prod') {
    return { 
      decision: "ESCALATE", 
      reason: "Prod environment requires explicit owner approval; silence is not consent." 
    };
  } else {
    // Non-prod silence proceeds after deadline
    return { 
      decision: "PROCEED", 
      reason: "Non-prod silent approval: No response within the 7-day governance window." 
    };
  }
}
