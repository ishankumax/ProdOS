
import { z } from "zod";

export const GoalTypeSchema = z.enum(["daily", "weekly", "monthly"]);

export const GoalSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1),
  type: GoalTypeSchema,
  completed: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().optional().nullable(),
});

export const HabitSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1),
  created_at: z.string(),
});

export const HabitLogSchema = z.object({
  id: z.string().uuid(),
  habit_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  completed: z.boolean(),
});

export const WeeklyDataSchema = z.object({
  goals: z.array(GoalSchema),
  habits: z.array(HabitSchema),
  logs: z.array(HabitLogSchema),
});

export type GoalSchemaType = z.infer<typeof GoalSchema>;
export type HabitSchemaType = z.infer<typeof HabitSchema>;
export type HabitLogSchemaType = z.infer<typeof HabitLogSchema>;
