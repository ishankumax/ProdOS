import { describe, it, expect } from "vitest";
import { DefineKpiSchema, UpdateKpiSchema, LogKpiSchema } from "../lib/validation/kpi";

describe("KPI Validation Schemas", () => {
  describe("DefineKpiSchema", () => {
    const validKpiBase = {
      domainId: "123e4567-e89b-12d3-a456-426614174000",
      name: "   Outreach Messages   ",
      metricType: "input",
      unit: "   Messages   ",
      targetValue: 50,
    };

    it("should pass validation and trim string values", () => {
      const result = DefineKpiSchema.safeParse(validKpiBase);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Outreach Messages");
        expect(result.data.unit).toBe("Messages");
        expect(result.data.targetValue).toBe(50);
      }
    });

    it("should reject empty names or units", () => {
      const emptyName = { ...validKpiBase, name: "   " };
      const emptyUnit = { ...validKpiBase, unit: "   " };

      expect(DefineKpiSchema.safeParse(emptyName).success).toBe(false);
      expect(DefineKpiSchema.safeParse(emptyUnit).success).toBe(false);
    });

    it("should reject negative or zero target values", () => {
      const negativeTarget = { ...validKpiBase, targetValue: -5 };
      const zeroTarget = { ...validKpiBase, targetValue: 0 };

      expect(DefineKpiSchema.safeParse(negativeTarget).success).toBe(false);
      expect(DefineKpiSchema.safeParse(zeroTarget).success).toBe(false);
    });

    it("should accept undefined or null target values", () => {
      const nullTarget = { ...validKpiBase, targetValue: null };
      const missingTarget = { ...validKpiBase, targetValue: undefined };

      expect(DefineKpiSchema.safeParse(nullTarget).success).toBe(true);
      expect(DefineKpiSchema.safeParse(missingTarget).success).toBe(true);
    });
  });

  describe("UpdateKpiSchema", () => {
    it("should require a valid KPI id UUID", () => {
      const invalidId = {
        id: "invalid-uuid",
        name: "New Name",
      };
      const result = UpdateKpiSchema.safeParse(invalidId);
      expect(result.success).toBe(false);
    });

    it("should validate partial updates successfully", () => {
      const partialUpdate = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Revenue in USD",
      };
      const result = UpdateKpiSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Revenue in USD");
        expect(result.data.metricType).toBe("input");
      }
    });
  });

  describe("LogKpiSchema", () => {
    const validLogBase = {
      kpiDefinitionId: "123e4567-e89b-12d3-a456-426614174000",
      value: 125.50,
      logDate: "2026-06-15",
      notes: "   Logged daily sales   ",
    };

    it("should validate log inputs successfully and trim notes", () => {
      const result = LogKpiSchema.safeParse(validLogBase);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.notes).toBe("Logged daily sales");
      }
    });

    it("should reject invalid date formats", () => {
      const invalidDates = ["2026/06/15", "15-06-2026", "today"];
      for (const date of invalidDates) {
        const payload = { ...validLogBase, logDate: date };
        expect(LogKpiSchema.safeParse(payload).success).toBe(false);
      }
    });

    it("should reject non-numeric log values", () => {
      const invalidValue = { ...validLogBase, value: "hundred" };
      expect(LogKpiSchema.safeParse(invalidValue).success).toBe(false);
    });
  });
});
