import { calendarDate, Day, Meal } from "../../globals";
import { loadMealsFromCSV } from "./csvLoader";
import { applyAllFilters, getPreferredMeals } from "./mealFilters";

export async function mealAlgorithm(
  planLength: number,
  totalCalories: number,
  dietaryRestrictions: string[],
  allergyIngredients: string[],
  downvotedMealIds: number[],
  preferredMealIds: number[],
  startDate: calendarDate
  // maintenance?: number
): Promise<Day[]> {
  // Load all meals from CSV (cached after first load)
  const allMeals = loadMealsFromCSV();
  console.log(`Loaded ${allMeals.length} meals from CSV`);
  console.log(
    `[mealAlgorithm] Received totalCalories parameter: ${totalCalories}`
  );
  // Apply global filters (calories will be applied per meal time in pickMeal)
  const baseFilteredMeals = applyAllFilters(allMeals, {
    dietaryRestrictions,
    allergyIngredients,
    downvotedIds: downvotedMealIds,
  });

  if (totalCalories < 1400) {
    console.log(
      `[mealAlgorithm] WARNING: totalCalories ${totalCalories} was below 1400, clamping to 1400`
    );
    totalCalories = 1400;
  }
  console.log(`[mealAlgorithm] Final totalCalories to use: ${totalCalories}`); // totalCalories is being computed correctly

  // Get preferred meals from filtered set
  const preferredMeals = getPreferredMeals(baseFilteredMeals, preferredMealIds);

  const plan: Day[] = [];
  const currentDate = { ...startDate };

  const breakfastCalories = (1 / 4) * totalCalories;
  // Generate meal plan for each day
  for (let i = 0; i < planLength; i++) {
    const breakfast = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "breakfast",
      breakfastCalories
    );

    const breakfastTotal = breakfast.calories * breakfast.serving;
    const lunchCalories = (totalCalories - breakfastTotal) / 2;

    const lunch = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "lunch",
      lunchCalories
    );

    const lunchTotal = lunch.calories * lunch.serving;
    const dinnerCalories = totalCalories - breakfastTotal - lunchTotal;

    const dinner = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "dinner",
      dinnerCalories
    );

    // End-of-day correction: ensure total is within 10% of target (and >= 1200 minimum)
    let dayCalories =
      breakfast.calories * breakfast.serving +
      lunch.calories * lunch.serving +
      dinner.calories * dinner.serving;

    // Guard against NaN from any malformed data
    if (!Number.isFinite(dayCalories)) {
      dayCalories = 0;
    }

    const minCalories = Math.max(1200, totalCalories * 0.9); // 90% of target or 1200, whichever is higher
    const maxCalories = totalCalories * 1.1; // 110% of target

    // Adjust servings to get within target range
    const MAX_ADJUSTMENT_ITERATIONS = 50;
    let adjustmentAttempts = 0;

    while (
      adjustmentAttempts < MAX_ADJUSTMENT_ITERATIONS &&
      (dayCalories < minCalories || dayCalories > maxCalories)
    ) {
      adjustmentAttempts++;

      if (dayCalories < minCalories) {
        // Need to increase calories - prioritize dinner, then lunch, then breakfast
        const deficit = minCalories - dayCalories;

        // Try increasing dinner first
        if (dinner.serving < 100) {
          const increment = Math.min(0.5, deficit / (2 * dinner.calories)); // Conservative increment
          dinner.serving = Math.min(
            100,
            dinner.serving + Math.max(0.5, increment)
          );
        }
        // Then lunch
        else if (lunch.serving < 100) {
          const increment = Math.min(0.5, deficit / (2 * lunch.calories));
          lunch.serving = Math.min(
            100,
            lunch.serving + Math.max(0.5, increment)
          );
        }
        // Finally breakfast
        else if (breakfast.serving < 100) {
          const increment = Math.min(0.5, deficit / (2 * breakfast.calories));
          breakfast.serving = Math.min(
            100,
            breakfast.serving + Math.max(0.5, increment)
          );
        } else {
          // All at max, can't increase further
          console.warn(
            `Warning: Cannot reach minCalories ${minCalories} (got ${dayCalories}). All servings at max.`
          );
          break;
        }
      } else if (dayCalories > maxCalories) {
        // Need to decrease calories - prioritize dinner, then lunch, then breakfast
        const excess = dayCalories - maxCalories;

        // Try decreasing dinner first
        if (dinner.serving > 0.5) {
          const decrement = Math.min(0.5, excess / (2 * dinner.calories));
          dinner.serving = Math.max(
            0.5,
            dinner.serving - Math.max(0.5, decrement)
          );
        }
        // Then lunch
        else if (lunch.serving > 0.5) {
          const decrement = Math.min(0.5, excess / (2 * lunch.calories));
          lunch.serving = Math.max(
            0.5,
            lunch.serving - Math.max(0.5, decrement)
          );
        }
        // Finally breakfast
        else if (breakfast.serving > 0.5) {
          const decrement = Math.min(0.5, excess / (2 * breakfast.calories));
          breakfast.serving = Math.max(
            0.5,
            breakfast.serving - Math.max(0.5, decrement)
          );
        } else {
          // All at minimum, can't decrease further
          console.warn(
            `Warning: Cannot reduce to maxCalories ${maxCalories} (got ${dayCalories}). All servings at minimum.`
          );
          break;
        }
      }

      // Recalculate day calories
      dayCalories =
        breakfast.calories * breakfast.serving +
        lunch.calories * lunch.serving +
        dinner.calories * dinner.serving;
    }

    // Final validation
    if (dayCalories < minCalories || dayCalories > maxCalories) {
      console.warn(
        `Warning: Day ${i + 1} calories ${dayCalories.toFixed(
          0
        )} outside target range [${minCalories.toFixed(
          0
        )}, ${maxCalories.toFixed(0)}] (${(
          (dayCalories / totalCalories) *
          100
        ).toFixed(1)}% of target)`
      );
    }

    const percentOfTarget = ((dayCalories / totalCalories) * 100).toFixed(1);
    console.log(
      `Day ${i + 1}: Target=${totalCalories} cal, Actual=${dayCalories.toFixed(
        0
      )} cal (${percentOfTarget}% of target) - ` +
        `B:${(breakfast.calories * breakfast.serving).toFixed(0)} L:${(
          lunch.calories * lunch.serving
        ).toFixed(0)} D:${(dinner.calories * dinner.serving).toFixed(0)}`
    );

    const dayPlan: Day = {
      date: { ...currentDate },
      breakfast,
      lunch,
      dinner,
    };
    plan.push(dayPlan);

    // Increment date for next day
    incrementDate(currentDate);
  }

  return plan;
}

/**
 * Helper function to increment a calendar date by one day
 */
function incrementDate(date: calendarDate): void {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNum = parseInt(date.month);
  const dayNum = parseInt(date.day);
  const yearNum = parseInt(date.year);

  // Check for leap year
  if (monthNum === 2 && isLeapYear(yearNum)) {
    daysInMonth[1] = 29;
  }

  if (dayNum < daysInMonth[monthNum - 1]) {
    date.day = String(dayNum + 1);
  } else {
    date.day = "1";
    if (monthNum < 12) {
      date.month = String(monthNum + 1);
    } else {
      date.month = "1";
      date.year = String(yearNum + 1);
    }
  }
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export async function pickMeal(
  allCandidates: Meal[],
  allPreferred: Meal[],
  mealTime: "breakfast" | "lunch" | "dinner" | "dessert",
  targetCalories: number
): Promise<Meal> {
  // Filter candidates and preferred by meal time and calories
  const candidates = applyAllFilters(allCandidates, {
    mealTime,
    targetCalories,
    calorieRange: 50,
  });

  const preferred = applyAllFilters(allPreferred, {
    mealTime,
    targetCalories,
    calorieRange: 50,
  });

  if (candidates.length === 0) {
    throw new Error(
      `No meals available for ${mealTime} with target calories ${targetCalories}`
    );
  }

  let selectedMeal: Meal = candidates[0]; // fallback

  // Try up to 50 times to find a meal with < 4 occurrences
  for (let attempt = 0; attempt < 50; attempt++) {
    const randomValue = Math.random();

    // 60% from candidates, 40% from preferred
    if (randomValue < 0.6 || preferred.length === 0) {
      const randomIndex = Math.floor(Math.random() * candidates.length);
      selectedMeal = candidates[randomIndex];
    } else {
      const randomIndex = Math.floor(Math.random() * preferred.length);
      selectedMeal = preferred[randomIndex];
    }

    // Accept if occurrences < 4, or if this is our last attempt
    if (selectedMeal.occurrences < 4 || attempt >= 50) {
      selectedMeal.occurrences += 1;
      break;
    }
  }

  // Return a deep clone to avoid mutating the shared meal object
  return {
    ...selectedMeal,
    serving: selectedMeal.serving, // Reset serving for new meal instances
    occurrences: selectedMeal.occurrences, // Keep the updated occurrence count
  };
}

export async function mockMealAlgorithm(): Promise<Day[]> {
  // Return a fixed mock meal plan for testing
  return [
    {
      date: { day: "1", month: "1", year: "2024" },
      breakfast: {
        id: 1,
        name: "Mock Breakfast",
        mealTime: "breakfast",
        diet: "vegetarian",
        ingredients: "eggs, toast",
        website: "http://example.com/breakfast",
        calories: 300,
        serving: 1,
        occurrences: 0,
      },
      lunch: {
        id: 2,
        name: "Mock Lunch",
        mealTime: "lunch",
        diet: "vegan",
        ingredients: "salad, tofu",
        website: "http://example.com/lunch",
        calories: 500,
        serving: 1,
        occurrences: 0,
      },
      dinner: {
        id: 3,
        name: "Mock Dinner",
        mealTime: "dinner",
        diet: " none",
        ingredients: "chicken, rice",
        website: "http://example.com/dinner",
        calories: 700,
        serving: 1,
        occurrences: 0,
      },
    },
  ];
}

// export async function mockMealAlgorithm(
//   dailyCalories: number,
//   dietaryRestrictions: string[],
//   mealFrequency: Map<Meal, number>[],
//   date: calendarDate
// ): Promise<Day> {
//   return {
//     date: date,
//     breakfast: {
//       id: 53118,
//       name: "Rømmegrøt – Norwegian Sour Cream Porridge",
//       mealTime: "breakfast",
//       ingredients:
//         "Full fat sour cream: 2 cups ; Flour: 3/4 cup; Milk: 2 cups ; Salt: 1 tsp; Sugar: Sprinkling; Cinnamon: Sprinkling; Butter: To taste",
//       website: "https://www.youtube.com/watch?v=v4rIJOWXM3w",
//       calories: 550,
//       occurrences: 0,
//     },
//     lunch: {
//       id: 52940,
//       name: "Brown Stew Chicken",
//       mealTime: "lunch",
//       ingredients:
//         "Chicken: 1 whole; Tomato: 1 chopped; Onions: 2 chopped; Garlic Clove: 2 chopped; Red Pepper: 1 chopped; Carrots: 1 chopped; Lime: 1; Thyme: 2 tsp; Allspice: 1 tsp ; Soy Sauce: 2 tbs; Cornstarch: 2 tsp; Coconut Milk: 2 cups ; Vegetable Oil: 1 tbs",
//       website: "https://www.youtube.com/watch?v=_gFB1fkNhXs",
//       calories: 650,
//       occurrences: 0,
//     },
//     dinner: {
//       id: 52955,
//       name: "Egg Drop Soup",
//       mealTime: "dinner",
//       ingredients:
//         "Chicken Stock: 3 cups ; Salt: 1/4 tsp; Sugar: 1/4 tsp; Pepper: pinch; Sesame Seed Oil: 1 tsp ; Peas: 1/3 cup; Mushrooms: 1/3 cup; Cornstarch: 1 tbs; Water: 2 tbs; Spring Onions: 1/4 cup",
//       website: "https://www.youtube.com/watch?v=9XpzHm9QpZg",
//       calories: 650,
//       occurrences: 0,
//     },
//   };
// }
