import { Meal } from "../../globals";


// for commiting 
/**
 * Filter meals by calorie range
 */
export function filterMealsByCalories(
  meals: Meal[],
  targetCalories: number,
  rangeSize: number = 100
): Meal[] {
  // TEMPORARY FIX: Use the rangeSize parameter to allow wider calorie ranges
  // TODO: Once CSV has more meals, the default rangeSize of 100 should work fine
  const halfRange = rangeSize / 2;
  const lowerBound = targetCalories - halfRange;
  const upperBound = targetCalories + halfRange;

  return meals.filter(
    (meal) => meal.calories >= lowerBound && meal.calories <= upperBound
  );
}

/**
 * Filter meals by dietary restrictions (vegan, vegetarian, none, etc.)
 * Removes meals whose diet fields do not match all restrictions
 */
export function filterByDietaryRestrictions(
  meals: Meal[],
  restrictions: string[]
): Meal[] {
    if (restrictions.includes("none")) return meals;
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
  if (allergyIngredients.length === 0) return meals;

  const allergiesLower = allergyIngredients.map((a) => a.toLowerCase());

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
 */
export function filterByMealTime(
  meals: Meal[],
  mealTime: "breakfast" | "lunch" | "dinner" | "dessert"
): Meal[] {
  return meals.filter((meal) => meal.mealTime === mealTime);
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

  if (options.targetCalories !== undefined) {
    filtered = filterMealsByCalories(
      filtered,
      options.targetCalories,
      options.calorieRange
    );
  }

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

  return filtered;
}