import { z } from "zod";

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(1000, "Task title must be under 1000 characters"),
  domainId: z.string().uuid("Invalid Domain ID").nullable().optional(),
  weeklyTargetId: z.string().uuid("Invalid Weekly Target ID").nullable().optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be formatted as YYYY-MM-DD"),
  weight: z.number().positive("Weight must be greater than zero").default(1.00),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  id: z.string().uuid("Invalid Task ID"),
});

export const ToggleTaskSchema = z.object({
  id: z.string().uuid("Invalid Task ID"),
  completed: z.boolean(),
});
