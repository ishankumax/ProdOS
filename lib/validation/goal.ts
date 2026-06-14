import { z } from "zod";

export const CreateGoalSchema = z
  .object({
    domainId: z.string().uuid("Invalid Domain ID"),
    title: z.string().trim().min(1, "Goal title is required").max(255),
    description: z.string().trim().max(1000).optional().nullable(),
    goalType: z.enum(["numeric", "boolean", "milestone"]).default("numeric"),
    yearlyTarget: z.number().positive("Target must be greater than 0"),
    unit: z.enum(["count", "currency", "hours", "days", "kilograms", "percentage", "custom"]).default("count"),
    customUnit: z.string().trim().max(50).optional().nullable(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
    status: z.enum(["active", "completed", "paused", "future"]).default("future")
  })
  .superRefine((data, ctx) => {
    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before or equal to End date",
        path: ["startDate"]
      });
    }
    if (data.unit === "custom" && (!data.customUnit || data.customUnit.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom unit name is required when unit type is 'custom'",
        path: ["customUnit"]
      });
    }
  });

export const UpdateGoalSchema = z
  .object({
    id: z.string().uuid("Invalid Goal ID"),
    domainId: z.string().uuid("Invalid Domain ID").optional(),
    title: z.string().trim().min(1).max(255).optional(),
    description: z.string().trim().max(1000).optional().nullable(),
    goalType: z.enum(["numeric", "boolean", "milestone"]).optional(),
    yearlyTarget: z.number().positive().optional(),
    unit: z.enum(["count", "currency", "hours", "days", "kilograms", "percentage", "custom"]).optional(),
    customUnit: z.string().trim().max(50).optional().nullable(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    status: z.enum(["active", "completed", "paused", "future"]).optional()
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start date must be before or equal to End date",
        path: ["startDate"]
      });
    }
    if (data.unit === "custom" && (!data.customUnit || data.customUnit.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Custom unit name is required when unit type is 'custom'",
        path: ["customUnit"]
      });
    }
  });
