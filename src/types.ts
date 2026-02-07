
export type CloudProvider = "Azure" | "AWS" | "GCP";
export type ResourceType = "VM" | "Disk" | "EBS" | "RDS" | "IP" | "NIC" | string;

export interface GhostHunterInput {
  cloud: CloudProvider;
  account: string;
  region: string;
  resourceType: ResourceType;
  resourceId: string;
  tags: Record<string, string>;
  lastAccessDays: number;
  monthlyCost: number;
  env: "non-prod" | "prod";
  context: {
    activeIncident: boolean;
    releaseWindow: boolean;
    freezeWindow: boolean;
    cabRequired: boolean;
  };
}

export interface GhostHunterOutput {
  decision: "PROCEED" | "DEFER" | "ESCALATE" | "NO-ACTION";
  reason: string;
  communications: Array<{
    channel: "Teams";
    to: string;
    message: string;
    buttons: string[];
  }>;
  tickets: Array<{
    type: "change" | "incident" | "task";
    system: "ServiceNow";
    id: string;
    link: string;
  }>;
  scheduled_operations: Array<{
    action: "snapshot" | "retire" | "re-prompt" | "re-evaluate";
    when: string;
    details: any;
  }>;
  audit: {
    signals: string[];
    policyVersion: "GH-1.0";
    initiator: "Ghost-Hunter";
    requestId: string;
  };
  savings: {
    estimatedMonthlyUSD: number;
  };
}
