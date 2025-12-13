import { UserConstraints, calendarDate } from "../../globals";


export function baseCalorieCalculator(constraints: UserConstraints): number {
  // Normalize height to centimeters based on unit
  let heightCm: number;
  if (constraints.height.unit === "ft-in") {
    const feet = (constraints.height.value as [number, number])[0];
    const inches = (constraints.height.value as [number, number])[1];
    heightCm = feet * 30.48 + inches * 2.54;
  } else if (constraints.height.unit === "inch") {
    const inches = constraints.height.value;
    heightCm = inches * 2.54;
  } else {
    // "m"
    const meters = constraints.height.value;
    heightCm = meters * 100;
  }

  // Normalize weight to kilograms based on unit
  let weightKg: number;
  if (constraints.weight.unit === "lb") {
    const pounds = constraints.weight.value as number;
    weightKg = pounds * 0.453592;
  } else {
    weightKg = constraints.weight.value as number;
  }

  // Normalize activity level multiplier
  let activityLevelMultiplier = 1.2; // default: sedentary
  if (constraints.activityLevel === "lightly-active") {
    activityLevelMultiplier = 1.375;
  } else if (constraints.activityLevel === "moderately-active") {
    activityLevelMultiplier = 1.55;
  } else if (constraints.activityLevel === "active") {
    activityLevelMultiplier = 1.725;
  } else if (constraints.activityLevel === "very-active") {
    activityLevelMultiplier = 1.9;
  }

  // Normalise activity level
  if (constraints.activityLevel === "lightly-active") {
    activityLevelMultiplier = 1.375;
  } else if (constraints.activityLevel === "moderately-active") {
    activityLevelMultiplier = 1.55;
  } else if (constraints.activityLevel === "active") {
    activityLevelMultiplier = 1.725;
  } else if (constraints.activityLevel === "very-active") {
    activityLevelMultiplier = 1.9;
  }

  let calories = 10 * weightKg + 6.25 * heightCm - 5 * constraints.age;

  // Adjust for sex
  if (constraints.sex === "M") {
    calories += 5;
  } else {
    calories -= 161;
  }

  const finalCalories = calories * activityLevelMultiplier;
  console.log(`[baseCalorieCalculator] BMR: ${calories.toFixed(1)}, Activity: ${activityLevelMultiplier}, Final: ${finalCalories.toFixed(1)}`);
  return finalCalories;
}

export function exerciseAdjustedCalorieCalculator(
  constraints: UserConstraints,
  baseCalories: number
): number {
  console.log(`[exerciseAdjustedCalorieCalculator] Input baseCalories: ${baseCalories}, weightGoal: ${constraints.weightGoal}`);
  let adjustedCalories = baseCalories;

  // Check all the different goals available
  switch (constraints.weightGoal) {
    case "extreme-loss":
      // Only subtract 50 if we are below 1600
      if (baseCalories < 1600) {
        adjustedCalories -= 50;
      }
      // Make sure we don't go below 1550 for this part
      else if (baseCalories >= 1600 && baseCalories < 2000) {
        if (baseCalories < 1800) {
          adjustedCalories = 1550;
        } else {
          adjustedCalories -= 250;
        }
      }
      // Subtract 300 in this range
      else if (baseCalories >= 2000 && baseCalories < 2500) {
        adjustedCalories -= 300;
      }
      // Subtract 400 in this range
      else if (baseCalories >= 2500 && baseCalories < 3000) {
        adjustedCalories -= 400;
      }
      // Subtract 500 above 3000
      else if (baseCalories >= 3000) {
        adjustedCalories -= 500;
      }
      break;

    case "weight-loss":
      // Only subtract 25 if we are below 1600
      if (baseCalories < 1600) {
        adjustedCalories -= 25;
      }
      // Make sure we don't do below 1575
      else if (baseCalories >= 1600 && baseCalories < 2000) {
        if (baseCalories < 1700) {
          adjustedCalories = 1575;
        } else {
          adjustedCalories -= 125;
        }
      } else if (baseCalories >= 2000 && baseCalories < 2500) {
        adjustedCalories -= 150;
      } else if (baseCalories >= 2500 && baseCalories < 3000) {
        adjustedCalories -= 200;
      } else if (baseCalories >= 3000) {
        adjustedCalories -= 250;
      }
      break;

    case "maintain": {
      adjustedCalories = baseCalories;
      break;
    }

    case "weight-gain":
      // Add 50 if we are below 1600
      if (baseCalories < 1600) {
        adjustedCalories += 50;
      } else if (baseCalories >= 1600 && baseCalories < 2000) {
        adjustedCalories += 125;
      }
      // For all others add 150
      else {
        adjustedCalories += 150;
      }
      break;
    case "extreme-gain":
      // Add 100 if we are below 1600
      if (baseCalories < 1600) {
        adjustedCalories += 100;
      } else if (baseCalories >= 1600 && baseCalories < 2000) {
        adjustedCalories += 250;
      }
      // For all others add 300
      else {
        adjustedCalories += 300;
      break;
  }

  console.log(`[exerciseAdjustedCalorieCalculator] Output adjustedCalories: ${adjustedCalories}`);
  return adjustedCalories;
} return adjustedCalories;
}

/**
 * Calculates the date for a given day offset from the start date
 * @param startDate - The starting date object with day, month, year strings
 * @param dayOffset - Number of days to add to the start date (0-indexed)
 * @returns A calendarDate object for the calculated date
 */
export function calculateDateForDay(
  startDate: calendarDate,
  dayOffset: number
): calendarDate {
  const date = new Date(
    parseInt(startDate.year),
    parseInt(startDate.month) - 1,
    parseInt(startDate.day)
  );

  date.setDate(date.getDate() + dayOffset);

  return {
    day: date.getDate().toString(),
    month: (date.getMonth() + 1).toString(),
    year: date.getFullYear().toString(),
  };
}
