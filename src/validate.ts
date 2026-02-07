
import { z } from 'zod';
import { GhostHunterInput } from './types';

const InputSchema = z.object({
  cloud: z.enum(["Azure", "AWS", "GCP"]),
  account: z.string(),
  region: z.string(),
  resourceType: z.string(),
  resourceId: z.string(),
  tags: z.record(z.string()),
  lastAccessDays: z.number(),
  monthlyCost: z.number(),
  env: z.enum(["non-prod", "prod"]),
  context: z.object({
    activeIncident: z.boolean(),
    releaseWindow: z.boolean(),
    freezeWindow: z.boolean(),
    cabRequired: z.boolean(),
  })
});

export function validateInput(input: any): GhostHunterInput {
  return InputSchema.parse(input);
}
