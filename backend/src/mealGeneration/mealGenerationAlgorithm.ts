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
): Promise<Day[]> {
  // Load all meals from CSV (cached after first load)
  const allMeals = loadMealsFromCSV();
    console.log(`Loaded ${allMeals.length} meals from CSV`);
  // Apply global filters (calories will be applied per meal time in pickMeal)
  const baseFilteredMeals = applyAllFilters(allMeals, {
    dietaryRestrictions,
    allergyIngredients,
    downvotedIds: downvotedMealIds,
  });

  // Get preferred meals from filtered set
  const preferredMeals = getPreferredMeals(baseFilteredMeals, preferredMealIds);

  const plan: Day[] = [];
  const currentDate = { ...startDate };

  const breakfastCalories = 1/3 * totalCalories;
  // Generate meal plan for each day
  for (let i = 0; i < planLength; i++) {
    const breakfast = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "breakfast",
      breakfastCalories
    );

    const lunchCalories = (totalCalories - breakfast.calories)/2;

    const lunch = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "lunch",
      lunchCalories
    );

    const dinnerCalories = totalCalories - breakfast.calories - lunch.calories;

    const dinner = await pickMeal(
      baseFilteredMeals,
      preferredMeals,
      "dinner",
      dinnerCalories
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
    calorieRange: 100,
  });

  const preferred = applyAllFilters(allPreferred, {
    mealTime,
    targetCalories,
    calorieRange: 100,
  });

  if (candidates.length === 0) {
    throw new Error(
      `No meals available for ${mealTime} with target calories ${targetCalories}`
    );
  }

  let selectedMeal: Meal = candidates[0]; // fallback

  // Try up to 10 times to find a meal with < 4 occurrences
  for (let attempt = 0; attempt < 10; attempt++) {
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
    if (selectedMeal.occurrences < 4 || attempt >= 9) {
      selectedMeal.occurrences += 1;
      break;
    }
  }

  return selectedMeal;
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
        occurrences: 0,
      },
    },
  ];
}

