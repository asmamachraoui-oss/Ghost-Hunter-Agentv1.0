
import { GhostHunterInput, GhostHunterOutput } from './types';

export function generateChangePayload(input: GhostHunterInput, decision: string) {
  const isProd = input.env === 'prod';
  const type = isProd ? "Normal" : "Standard";
  
  return {
    system: "ServiceNow",
    type: isProd ? "change" : "task",
    id: `CHG-${Math.floor(Math.random() * 900000) + 100000}`,
    link: `https://service-now.com/nav_to.do?uri=change_request.do?sys_id=simulated`,
    details: {
      category: "Cloud Governance",
      short_description: `[Ghost-Hunter] Retirement of ${input.resourceType}: ${input.resourceId}`,
      environment: input.env,
      risk: isProd ? "Moderate" : "Low",
      cab_approval_required: isProd,
      implementation_plan: "1. Snapshot Resource 2. Verify Snapshot 3. Terminate Resource"
    }
  };
}
