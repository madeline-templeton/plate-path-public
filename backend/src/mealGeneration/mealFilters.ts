import { Meal } from "../../globals";


// // for commiting 
// /**
//  * Filter meals by calorie range
//  */
// export function filterMealsByCalories(
//   meals: Meal[],
//   targetCalories: number,
//   rangeSize: number = 100
// ): Meal[] {
//   // TEMPORARY FIX: Use the rangeSize parameter to allow wider calorie ranges
//   // TODO: Once CSV has more meals, the default rangeSize of 100 should work fine
//   const halfRange = rangeSize / 100;
//   const lowerBound = targetCalories - halfRange;
//   const upperBound = targetCalories + halfRange;

//   return meals.filter(
//     (meal) => meal.calories >= lowerBound && meal.calories <= upperBound
//   );
// }

/**
 * Filter meals by dietary restrictions (vegan, vegetarian, none, etc.)
 * Removes meals whose diet fields do not match all restrictions
 */
export function filterByDietaryRestrictions(
  meals: Meal[],
  restrictions: string[]
): Meal[] {
  // If restrictions is undefined or empty, default to "none"
  if (!restrictions || restrictions.length === 0) {
    restrictions = ["none"];
  }
  
  console.log("restrictions: " + restrictions[0])
  const restrictionsLower = restrictions.map((r) => r.toLowerCase());
  
  return meals.filter((meal) => {
    const ingredientsLower = meal.diet.toLowerCase();
    return restrictionsLower.every((restriction) =>
      ingredientsLower.includes(restriction)
    );
  });
}

/**
 * Filter out meals containing allergy ingredients
 * Checks ingredient strings for matches
 */
export function filterByAllergies(
  meals: Meal[],
  allergyIngredients: string[]
): Meal[] {
  // Normalize and drop empty/whitespace allergy entries
  const allergiesLower = allergyIngredients
    .map((a) => a.toLowerCase().trim())
    .filter((a) => a.length > 0);

  if (allergiesLower.length === 0) return meals;

  return meals.filter((meal) => {
    const ingredientsLower = meal.ingredients.toLowerCase();
    return !allergiesLower.some((allergy) =>
      ingredientsLower.includes(allergy)
    );
  });
}

/**
 * Remove downvoted meals by ID
 */
export function removeDownvotedMeals(
  meals: Meal[],
  downvotedIds: number[]
): Meal[] {
  if (downvotedIds.length === 0) return meals;

  const downvotedSet = new Set(downvotedIds);
  return meals.filter((meal) => !downvotedSet.has(meal.id));
}

/**
 * Filter meals by meal time (breakfast, lunch, dinner, dessert)
 * Now supports comma-separated meal times like "lunch, dinner" or "breakfast, lunch, dinner"
 */
export function filterByMealTime(
  meals: Meal[],
  mealTime: "breakfast" | "lunch" | "dinner" | "dessert"
): Meal[] {
  return meals.filter((meal) => {
    const mealTimesLower = meal.mealTime.toLowerCase();
    return mealTimesLower.includes(mealTime.toLowerCase());
  });
}

/**
 * Get preferred meals from a list of meal IDs
 */
export function getPreferredMeals(
  meals: Meal[],
  preferredIds: number[]
): Meal[] {
  if (preferredIds.length === 0) return [];

  const preferredSet = new Set(preferredIds);
  return meals.filter((meal) => preferredSet.has(meal.id));
}

export function adjustServings(
  meals: Meal[], 
  targetCalories: number
): Meal[] { 
  const tolerance = targetCalories * .2; // 20% tolerance
  const filteredMeals: Meal[] = [];

  for (const meal of meals) {
    let bestServing = 1;
    let bestDifference = Math.abs(targetCalories - meal.calories);
    let foundMatch = false;

    // Try different serving sizes in 0.5 increments (0.5 to 10)
    for (let serving = 0.5; serving <= 10; serving += 0.5) {
      const totalCalories = meal.calories * serving;
      const difference = Math.abs(targetCalories - totalCalories);

      // Check if within 20% tolerance
      if (difference <= tolerance) {
        foundMatch = true;
        // Keep the serving that's closest to target
        if (difference < bestDifference) {
          bestDifference = difference;
          bestServing = serving;
        }
      }
    }

    // Only include meal if we found a match within tolerance
    if (foundMatch) {
      meal.serving = bestServing;
      filteredMeals.push(meal);
    }
  }

  return filteredMeals;
}

/**
 * Apply all filters in sequence
 */
export function applyAllFilters(
  meals: Meal[],
  options: {
    targetCalories?: number; // make optional so that we can filter a base list without calorie targets 
    calorieRange?: number;
    dietaryRestrictions?: string[];
    allergyIngredients?: string[];
    downvotedIds?: number[];
    mealTime?: "breakfast" | "lunch" | "dinner" | "dessert";
  }
): Meal[] {
  let filtered = meals;

  if (options.dietaryRestrictions) {
    filtered = filterByDietaryRestrictions(
      filtered,
      options.dietaryRestrictions
    );
  }

  if (options.allergyIngredients) {
    filtered = filterByAllergies(filtered, options.allergyIngredients);
  }

  if (options.downvotedIds) {
    filtered = removeDownvotedMeals(filtered, options.downvotedIds);
  }

  if (options.mealTime) {
    filtered = filterByMealTime(filtered, options.mealTime);
  }

  if (options.targetCalories !== undefined) {
    filtered = adjustServings(
      filtered,
      options.targetCalories
    );
  }

  return filtered;
}