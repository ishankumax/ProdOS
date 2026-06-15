import { describe, it, expect } from "vitest";
import { CreateTaskSchema, UpdateTaskSchema, ToggleTaskSchema } from "../lib/validation/task";

describe("Task Validation Schemas", () => {
  describe("CreateTaskSchema", () => {
    const validTaskBase = {
      title: "  Review PR & Merge  ",
      domainId: "123e4567-e89b-12d3-a456-426614174000",
      weeklyTargetId: "123e4567-e89b-12d3-a456-426614174001",
      dueDate: "2026-06-15",
      weight: 1.5,
    };

    it("should pass validation and trim whitespace from title", () => {
      const result = CreateTaskSchema.safeParse(validTaskBase);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Review PR & Merge");
        expect(result.data.weight).toBe(1.5);
      }
    });

    it("should accept global tasks with null or missing domainId", () => {
      const globalTask = {
        ...validTaskBase,
        domainId: null,
        weeklyTargetId: null,
      };
      const result = CreateTaskSchema.safeParse(globalTask);
      expect(result.success).toBe(true);
    });

    it("should reject invalid/empty titles", () => {
      const emptyTitle = { ...validTaskBase, title: "   " };
      const result = CreateTaskSchema.safeParse(emptyTitle);
      expect(result.success).toBe(false);
    });

    it("should reject non-YYYY-MM-DD date formats", () => {
      const invalidDates = ["2026/06/15", "15-06-2026", "today"];
      for (const date of invalidDates) {
        const payload = { ...validTaskBase, dueDate: date };
        expect(CreateTaskSchema.safeParse(payload).success).toBe(false);
      }
    });

    it("should reject negative or zero weights", () => {
      const negativeWeight = { ...validTaskBase, weight: -1 };
      const zeroWeight = { ...validTaskBase, weight: 0 };

      expect(CreateTaskSchema.safeParse(negativeWeight).success).toBe(false);
      expect(CreateTaskSchema.safeParse(zeroWeight).success).toBe(false);
    });
  });

  describe("UpdateTaskSchema", () => {
    it("should require a valid task id UUID", () => {
      const invalidId = {
        id: "invalid-uuid",
        title: "Update Title",
      };
      const result = UpdateTaskSchema.safeParse(invalidId);
      expect(result.success).toBe(false);
    });

    it("should validate partial updates successfully", () => {
      const partialUpdate = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "Clean Office Desk",
      };
      const result = UpdateTaskSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Clean Office Desk");
        expect(result.data.weight).toBe(1.00);
      }
    });
  });

  describe("ToggleTaskSchema", () => {
    it("should validate toggle task inputs", () => {
      const validToggle = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        completed: true,
      };
      const invalidToggle = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        completed: "yes", // invalid type
      };

      expect(ToggleTaskSchema.safeParse(validToggle).success).toBe(true);
      expect(ToggleTaskSchema.safeParse(invalidToggle).success).toBe(false);
    });
  });
});
