import { z } from "zod";

export const CreateDomainSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Domain name is required")
    .max(100, "Domain name must be under 100 characters"),
  description: z
    .string()
    .trim()
    .max(1000, "Description must be under 1000 characters")
    .optional()
    .nullable(),
  iconKey: z.string().min(1).max(100).default("circle"),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be valid Hex format (e.g. #10B981)"),
  priority: z.enum(["critical", "high", "medium", "low"]).default("medium"),
  status: z.enum(["active", "paused"]).default("active")
});

export const UpdateDomainSchema = CreateDomainSchema.partial().extend({
  id: z.string().uuid("Invalid Domain ID")
});
