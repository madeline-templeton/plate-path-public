import { describe, it, expect } from "vitest";
import {
  baseCalorieCalculator,
  exerciseAdjustedCalorieCalculator,
} from "./mealGenerationHelpers";
import { UserConstraints } from "../../globals";

/**
 * Test suite for calorie calculation functions using known inputs and expected outputs.
 *
 * These tests use hand-calculated values based on the Mifflin-St Jeor equation:
 * BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + s
 * where s = +5 for males, -161 for females
 *
 * Then multiply by activity level multiplier for base calories.
 * Then adjust based on weight goal for exercise-adjusted calories.
 */

describe("Calorie Calculator Tests", () => {
  describe("baseCalorieCalculator", () => {
    it("calculates correctly for a sedentary male (ft-in, lb)", () => {
      // Test case: 30-year-old male, 6'0" (182.88 cm), 180 lbs (81.65 kg), sedentary
      // BMR = (10 × 81.65) + (6.25 × 182.88) - (5 × 30) + 5
      // BMR = 816.5 + 1143 - 150 + 5 = 1814.5
      // Base = BMR × 1.2 = 2177.4
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "maintain",
      };

      const result = baseCalorieCalculator(constraints);
      expect(result).toBeCloseTo(2177.4, 1); // Within 0.1 calories
    });

    it("calculates correctly for an active female (m, kg)", () => {
      // Test case: 25-year-old female, 1.65 m (165 cm), 60 kg, active
      // BMR = (10 × 60) + (6.25 × 165) - (5 × 25) - 161
      // BMR = 600 + 1031.25 - 125 - 161 = 1345.25
      // Base = BMR × 1.725 = 2320.56
      const constraints: UserConstraints = {
        age: 25,
        sex: "F",
        height: { unit: "m", value: [1.65] },
        weight: { unit: "kg", value: 60 },
        activityLevel: "active",
        weightGoal: "maintain",
      };

      const result = baseCalorieCalculator(constraints);
      expect(result).toBeCloseTo(2320.56, 1);
    });

    it("calculates correctly for a lightly-active male (inch, kg)", () => {
      // Test case: 40-year-old male, 70 inches (177.8 cm), 85 kg, lightly-active
      // BMR = (10 × 85) + (6.25 × 177.8) - (5 × 40) + 5
      // BMR = 850 + 1111.25 - 200 + 5 = 1766.25
      // Base = BMR × 1.375 = 2428.59
      const constraints: UserConstraints = {
        age: 40,
        sex: "M",
        height: { unit: "inch", value: 70 },
        weight: { unit: "kg", value: 85 },
        activityLevel: "lightly-active",
        weightGoal: "maintain",
      };

      const result = baseCalorieCalculator(constraints);
      expect(result).toBeCloseTo(2428.59, 1);
    });

    it("calculates correctly for a very-active female", () => {
      // Test case: 28-year-old female, 5'6" (167.64 cm), 140 lbs (63.50 kg), very-active
      // BMR = (10 × 63.50) + (6.25 × 167.64) - (5 × 28) - 161
      // BMR = 635 + 1047.75 - 140 - 161 = 1381.75
      // Base = BMR × 1.9 = 2625.33
      const constraints: UserConstraints = {
        age: 28,
        sex: "F",
        height: { unit: "ft-in", value: [5, 6] },
        weight: { unit: "lb", value: 140 },
        activityLevel: "very-active",
        weightGoal: "maintain",
      };

      const result = baseCalorieCalculator(constraints);
      expect(result).toBeCloseTo(2625.33, 1);
    });

    it("calculates correctly for a moderately-active older male", () => {
      // Test case: 65-year-old male, 5'10" (177.8 cm), 175 lbs (79.38 kg), moderately-active
      // BMR = (10 × 79.38) + (6.25 × 177.8) - (5 × 65) + 5
      // BMR = 793.8 + 1111.25 - 325 + 5 = 1585.05
      // Base = BMR × 1.55 = 2456.83
      const constraints: UserConstraints = {
        age: 65,
        sex: "M",
        height: { unit: "ft-in", value: [5, 10] },
        weight: { unit: "lb", value: 175 },
        activityLevel: "moderately-active",
        weightGoal: "maintain",
      };

      const result = baseCalorieCalculator(constraints);
      expect(result).toBeCloseTo(2456.83, 1);
    });
  });

  describe("exerciseAdjustedCalorieCalculator", () => {
    it("maintains calories for 'maintain' goal", () => {
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "maintain",
      };

      const baseCalories = 2200;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2200); // Should be unchanged
    });

    it("reduces calories for 'weight-loss' goal (baseCalories = 2500)", () => {
      // baseCalories = 2500 (falls in 2500-3000 range)
      // Should subtract 200
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "weight-loss",
      };

      const baseCalories = 2500;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2300);
    });

    it("reduces calories for 'extreme-loss' goal (baseCalories = 2800)", () => {
      // baseCalories = 2800 (falls in 2500-3000 range)
      // Should subtract 400
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "extreme-loss",
      };

      const baseCalories = 2800;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2400);
    });

    it("increases calories for 'weight-gain' goal (baseCalories = 2200)", () => {
      // baseCalories = 2200 (falls in 2000-2500 range, but no, 2200 is >= 2000 and < 2500, so >= 2000)
      // Actually 2200 >= 2000, so goes to else branch: add 150
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "weight-gain",
      };

      const baseCalories = 2200;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2350);
    });

    it("increases calories for 'extreme-gain' goal (baseCalories = 1800)", () => {
      // baseCalories = 1800 (falls in 1600-2000 range)
      // Should add 250
      const constraints: UserConstraints = {
        age: 30,
        sex: "M",
        height: { unit: "ft-in", value: [6, 0] },
        weight: { unit: "lb", value: 180 },
        activityLevel: "sedentary",
        weightGoal: "extreme-gain",
      };

      const baseCalories = 1800;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2050);
    });

    it("handles low baseline for 'weight-loss' goal (baseCalories = 1550)", () => {
      // baseCalories = 1550 (< 1600)
      // Should subtract 25
      const constraints: UserConstraints = {
        age: 30,
        sex: "F",
        height: { unit: "ft-in", value: [5, 2] },
        weight: { unit: "lb", value: 110 },
        activityLevel: "sedentary",
        weightGoal: "weight-loss",
      };

      const baseCalories = 1550;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(1525);
    });

    it("applies minimum floor for 'extreme-loss' goal (baseCalories = 1750)", () => {
      // baseCalories = 1750 (1600-2000 range, < 1800)
      // Should return 1550 (the floor)
      const constraints: UserConstraints = {
        age: 30,
        sex: "F",
        height: { unit: "ft-in", value: [5, 4] },
        weight: { unit: "lb", value: 120 },
        activityLevel: "sedentary",
        weightGoal: "extreme-loss",
      };

      const baseCalories = 1750;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(1550);
    });

    it("handles high baseline for 'weight-loss' goal (baseCalories = 3200)", () => {
      // baseCalories = 3200 (>= 3000)
      // Should subtract 250
      const constraints: UserConstraints = {
        age: 25,
        sex: "M",
        height: { unit: "ft-in", value: [6, 4] },
        weight: { unit: "lb", value: 220 },
        activityLevel: "very-active",
        weightGoal: "weight-loss",
      };

      const baseCalories = 3200;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(2950);
    });

    it("handles high baseline for 'extreme-loss' goal (baseCalories = 3500)", () => {
      // baseCalories = 3500 (>= 3000)
      // Should subtract 500
      const constraints: UserConstraints = {
        age: 25,
        sex: "M",
        height: { unit: "ft-in", value: [6, 4] },
        weight: { unit: "lb", value: 220 },
        activityLevel: "very-active",
        weightGoal: "extreme-loss",
      };

      const baseCalories = 3500;
      const result = exerciseAdjustedCalorieCalculator(
        constraints,
        baseCalories
      );
      expect(result).toBe(3000);
    });
  });

  describe("Integration: baseCalorieCalculator + exerciseAdjustedCalorieCalculator", () => {
    it("produces correct final calories for weight loss scenario", () => {
      // 35-year-old female, 5'5", 150 lbs, moderately-active, weight-loss
      // BMR = (10 × 68.04) + (6.25 × 165.1) - (5 × 35) - 161
      // BMR = 680.4 + 1031.875 - 175 - 161 = 1376.275
      // Base = 1376.275 × 1.55 = 2133.23
      // Adjusted (2000-2500 range): 2133.23 - 150 = 1983.23
      const constraints: UserConstraints = {
        age: 35,
        sex: "F",
        height: { unit: "ft-in", value: [5, 5] },
        weight: { unit: "lb", value: 150 },
        activityLevel: "moderately-active",
        weightGoal: "weight-loss",
      };

      const base = baseCalorieCalculator(constraints);
      expect(base).toBeCloseTo(2133.23, 1);

      const adjusted = exerciseAdjustedCalorieCalculator(constraints, base);
      expect(adjusted).toBeCloseTo(1983.23, 1);
    });

    it("produces correct final calories for weight gain scenario", () => {
      // 22-year-old male, 5'9", 145 lbs, active, weight-gain
      // BMR = (10 × 65.77) + (6.25 × 175.26) - (5 × 22) + 5
      // BMR = 657.7 + 1095.375 - 110 + 5 = 1648.075
      // Base = 1648.075 × 1.725 = 2842.93
      // Adjusted (>= 2000): 2842.93 + 150 = 2992.93
      const constraints: UserConstraints = {
        age: 22,
        sex: "M",
        height: { unit: "ft-in", value: [5, 9] },
        weight: { unit: "lb", value: 145 },
        activityLevel: "active",
        weightGoal: "weight-gain",
      };

      const base = baseCalorieCalculator(constraints);
      expect(base).toBeCloseTo(2842.93, 1);

      const adjusted = exerciseAdjustedCalorieCalculator(constraints, base);
      expect(adjusted).toBeCloseTo(2992.93, 1);
    });

    it("maintains calories correctly for maintenance goal", () => {
      // 50-year-old male, 5'11", 185 lbs, lightly-active, maintain
      const constraints: UserConstraints = {
        age: 50,
        sex: "M",
        height: { unit: "ft-in", value: [5, 11] },
        weight: { unit: "lb", value: 185 },
        activityLevel: "lightly-active",
        weightGoal: "maintain",
      };

      const base = baseCalorieCalculator(constraints);
      const adjusted = exerciseAdjustedCalorieCalculator(constraints, base);

      // For maintain, adjusted should equal base
      expect(adjusted).toBe(base);
    });
  });
});
