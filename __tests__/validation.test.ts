import { describe, it, expect } from "vitest";
import { CreateDomainSchema } from "../lib/validation/domain";
import { CreateGoalSchema } from "../lib/validation/goal";

describe("Validation Layer Schemas", () => {
  describe("CreateDomainSchema", () => {
    it("should pass validation for correctly formatted domains inputs", () => {
      const input = {
        name: "  ReadNovaStory  ",
        description: "Focus on publishing books",
        iconKey: "book-open",
        colorHex: "#10B981",
        priority: "high",
        status: "active",
      };

      const result = CreateDomainSchema.safeParse(input);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("ReadNovaStory"); // Trims name
      }
    });

    it("should reject invalid hex colors or empty names", () => {
      const emptyName = { name: "   ", colorHex: "#10B981" };
      const invalidHex = { name: "ITB", colorHex: "rgb(0,0,0)" };

      expect(CreateDomainSchema.safeParse(emptyName).success).toBe(false);
      expect(CreateDomainSchema.safeParse(invalidHex).success).toBe(false);
    });
  });

  describe("CreateGoalSchema", () => {
    const validBaseGoal = {
      domainId: "123e4567-e89b-12d3-a456-426614174000",
      title: "Write 10 books",
      goalType: "numeric",
      yearlyTarget: 10,
      unit: "count",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      status: "active",
    };

    it("should pass for valid goals", () => {
      const result = CreateGoalSchema.safeParse(validBaseGoal);
      expect(result.success).toBe(true);
    });

    it("should reject goals where end date is before start date", () => {
      const input = {
        ...validBaseGoal,
        startDate: "2026-12-31",
        endDate: "2026-01-01",
      };

      const result = CreateGoalSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should require customUnit when unit category is set to 'custom'", () => {
      const customUnitGoal = {
        ...validBaseGoal,
        unit: "custom",
        customUnit: "  ", // invalid empty unit
      };

      const result = CreateGoalSchema.safeParse(customUnitGoal);
      expect(result.success).toBe(false);
    });
  });
});
