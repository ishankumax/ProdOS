import { z } from "zod";

export const DefineKpiSchema = z.object({
  domainId: z.string().uuid("Invalid Domain ID"),
  name: z
    .string()
    .trim()
    .min(1, "Metric name is required")
    .max(100, "Metric name must be under 100 characters"),
  metricType: z.enum(["input", "output", "outcome"]).default("input"),
  unit: z
    .string()
    .trim()
    .min(1, "Unit name is required")
    .max(50, "Unit name must be under 50 characters"),
  targetValue: z.number().positive("Target value must be greater than zero").nullable().optional(),
});

export const UpdateKpiSchema = DefineKpiSchema.partial().extend({
  id: z.string().uuid("Invalid KPI Definition ID"),
});

export const LogKpiSchema = z.object({
  kpiDefinitionId: z.string().uuid("Invalid KPI Definition ID"),
  value: z.number({ required_error: "Value is required", invalid_type_error: "Value must be a number" }),
  logDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Log date must be formatted as YYYY-MM-DD"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be under 1000 characters")
    .nullable()
    .optional(),
});
