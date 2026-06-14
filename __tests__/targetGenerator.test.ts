import { describe, it, expect } from "vitest";
import { generateMonthlyTargets, generateWeeklyTargets } from "../features/goals/utils/targetGenerator";

describe("Target Generator Engine", () => {
  describe("generateMonthlyTargets()", () => {
    it("should partition yearly targets evenly across months", () => {
      const targets = generateMonthlyTargets(1200, "2026-01-01", "2026-12-31");
      expect(targets).toHaveLength(12);
      expect(targets[0]!.targetValue).toBe(100);
      expect(targets[11]!.targetValue).toBe(100);
      
      const totalSum = targets.reduce((sum, t) => sum + t.targetValue, 0);
      expect(totalSum).toBe(1200);
    });

    it("should reconcile decimal rounding imbalances in the final month", () => {
      const targets = generateMonthlyTargets(100, "2026-01-01", "2026-03-31");
      expect(targets).toHaveLength(3);
      expect(targets[0]!.targetValue).toBe(33.33);
      expect(targets[1]!.targetValue).toBe(33.33);
      expect(targets[2]!.targetValue).toBe(33.34); // reconciles the +0.01 imbalance

      const totalSum = targets.reduce((sum, t) => sum + t.targetValue, 0);
      expect(totalSum).toBe(100);
    });

    it("should throw an error for invalid start or end dates", () => {
      expect(() => generateMonthlyTargets(100, "invalid-date", "2026-12-31")).toThrow();
      expect(() => generateMonthlyTargets(100, "2026-12-31", "2026-01-01")).toThrow();
    });
  });

  describe("generateWeeklyTargets()", () => {
    it("should identify standard weeks touching a month and split targets", () => {
      // June 2026 has 5 weeks touching the month
      const targets = generateWeeklyTargets(500, "2026-06-01");
      expect(targets).toHaveLength(5);
      
      // 500 / 5 = 100 evenly
      expect(targets[0]!.targetValue).toBe(100);
      expect(targets[4]!.targetValue).toBe(100);
      
      const totalSum = targets.reduce((sum, t) => sum + t.targetValue, 0);
      expect(totalSum).toBe(500);
    });

    it("should partition uneven weeks and reconcile final values", () => {
      // 100 target split across 5 weeks
      const targets = generateWeeklyTargets(100, "2026-06-01");
      expect(targets).toHaveLength(5);
      expect(targets[0]!.targetValue).toBe(20);
      expect(targets[4]!.targetValue).toBe(20);

      const totalSum = targets.reduce((sum, t) => sum + t.targetValue, 0);
      expect(totalSum).toBe(100);
    });
  });
});
