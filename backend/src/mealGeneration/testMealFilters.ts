import { describe, it, expect } from "vitest";
import {
  filterByDietaryRestrictions,
  filterByAllergies,
  removeDownvotedMeals,
  filterByMealTime,
  getPreferredMeals,
  adjustServings,
  applyAllFilters,
} from "./mealFilters";
import { Meal } from "../../globals";

/**
 * Mock meal dataset with variety for comprehensive testing
 * Includes different meal times, diets, ingredients, and calorie counts
 */
const mockMeals: Meal[] = [
  // Breakfast meals
  {
    id: 1,
    name: "Vegan Oatmeal Bowl",
    mealTime: "breakfast",
    diet: "vegan",
    ingredients: "oats, almond milk, banana, maple syrup",
    website: "http://example.com/1",
    calories: 300,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 2,
    name: "Scrambled Eggs",
    mealTime: "breakfast",
    diet: "vegetarian",
    ingredients: "eggs, butter, milk, salt, pepper",
    website: "http://example.com/2",
    calories: 250,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 3,
    name: "Bacon and Eggs",
    mealTime: "breakfast",
    diet: "none",
    ingredients: "bacon, eggs, butter, salt, pepper",
    website: "http://example.com/3",
    calories: 450,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 4,
    name: "Peanut Butter Toast",
    mealTime: "breakfast",
    diet: "vegan",
    ingredients: "bread, peanut butter, banana",
    website: "http://example.com/4",
    calories: 350,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 5,
    name: "Greek Yogurt Parfait",
    mealTime: "breakfast",
    diet: "vegetarian",
    ingredients: "greek yogurt, honey, granola, berries",
    website: "http://example.com/5",
    calories: 280,
    serving: 1,
    occurrences: 0,
  },
  // Lunch meals
  {
    id: 6,
    name: "Vegan Buddha Bowl",
    mealTime: "lunch",
    diet: "vegan",
    ingredients: "quinoa, chickpeas, avocado, kale, tahini",
    website: "http://example.com/6",
    calories: 500,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 7,
    name: "Chicken Caesar Salad",
    mealTime: "lunch",
    diet: "none",
    ingredients:
      "chicken breast, romaine lettuce, parmesan, croutons, caesar dressing",
    website: "http://example.com/7",
    calories: 450,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 8,
    name: "Margherita Pizza",
    mealTime: "lunch",
    diet: "vegetarian",
    ingredients: "pizza dough, tomato sauce, mozzarella, basil",
    website: "http://example.com/8",
    calories: 600,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 9,
    name: "Tuna Sandwich",
    mealTime: "lunch",
    diet: "none",
    ingredients: "tuna, bread, mayo, lettuce, tomato",
    website: "http://example.com/9",
    calories: 400,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 10,
    name: "Lentil Soup",
    mealTime: "lunch",
    diet: "vegan",
    ingredients: "lentils, carrots, celery, onion, vegetable broth",
    website: "http://example.com/10",
    calories: 350,
    serving: 1,
    occurrences: 0,
  },
  // Dinner meals
  {
    id: 11,
    name: "Grilled Salmon",
    mealTime: "dinner",
    diet: "none",
    ingredients: "salmon, olive oil, lemon, garlic, asparagus",
    website: "http://example.com/11",
    calories: 550,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 12,
    name: "Vegetable Stir Fry",
    mealTime: "dinner",
    diet: "vegan",
    ingredients: "tofu, broccoli, bell peppers, soy sauce, ginger, rice",
    website: "http://example.com/12",
    calories: 480,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 13,
    name: "Beef Tacos",
    mealTime: "dinner",
    diet: "none",
    ingredients:
      "ground beef, taco shells, cheese, lettuce, tomato, sour cream",
    website: "http://example.com/13",
    calories: 650,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 14,
    name: "Eggplant Parmesan",
    mealTime: "dinner",
    diet: "vegetarian",
    ingredients: "eggplant, marinara sauce, mozzarella, parmesan, breadcrumbs",
    website: "http://example.com/14",
    calories: 520,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 15,
    name: "Chickpea Curry",
    mealTime: "dinner",
    diet: "vegan",
    ingredients:
      "chickpeas, coconut milk, curry powder, tomatoes, spinach, rice",
    website: "http://example.com/15",
    calories: 500,
    serving: 1,
    occurrences: 0,
  },
  // Dessert meals
  {
    id: 16,
    name: "Chocolate Cake",
    mealTime: "dessert",
    diet: "vegetarian",
    ingredients: "flour, sugar, cocoa powder, eggs, butter, milk",
    website: "http://example.com/16",
    calories: 400,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 17,
    name: "Vegan Brownie",
    mealTime: "dessert",
    diet: "vegan",
    ingredients: "flour, sugar, cocoa powder, applesauce, coconut oil",
    website: "http://example.com/17",
    calories: 350,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 18,
    name: "Ice Cream Sundae",
    mealTime: "dessert",
    diet: "vegetarian",
    ingredients: "ice cream, chocolate sauce, whipped cream, cherry",
    website: "http://example.com/18",
    calories: 450,
    serving: 1,
    occurrences: 0,
  },
  // Multi-meal time options
  {
    id: 19,
    name: "Avocado Toast",
    mealTime: "breakfast, lunch",
    diet: "vegan",
    ingredients: "bread, avocado, tomato, salt, pepper",
    website: "http://example.com/19",
    calories: 320,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 20,
    name: "Grilled Cheese",
    mealTime: "lunch, dinner",
    diet: "vegetarian",
    ingredients: "bread, cheddar cheese, butter",
    website: "http://example.com/20",
    calories: 380,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 21,
    name: "Fruit Salad",
    mealTime: "breakfast, lunch, dinner",
    diet: "vegan",
    ingredients: "strawberries, blueberries, grapes, watermelon, pineapple",
    website: "http://example.com/21",
    calories: 150,
    serving: 1,
    occurrences: 0,
  },
  // Meals with common allergens
  {
    id: 22,
    name: "Peanut Noodles",
    mealTime: "dinner",
    diet: "vegan",
    ingredients: "noodles, peanut sauce, vegetables, sesame oil",
    website: "http://example.com/22",
    calories: 480,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 23,
    name: "Shrimp Pasta",
    mealTime: "dinner",
    diet: "none",
    ingredients: "shrimp, pasta, garlic, white wine, parsley",
    website: "http://example.com/23",
    calories: 550,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 24,
    name: "Almond Crusted Chicken",
    mealTime: "dinner",
    diet: "none",
    ingredients: "chicken breast, almonds, breadcrumbs, eggs",
    website: "http://example.com/24",
    calories: 500,
    serving: 1,
    occurrences: 0,
  },
  // Additional variety for calorie testing
  {
    id: 25,
    name: "Light Salad",
    mealTime: "lunch",
    diet: "vegan",
    ingredients: "mixed greens, cucumber, tomato, vinaigrette",
    website: "http://example.com/25",
    calories: 100,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 26,
    name: "Protein Smoothie",
    mealTime: "breakfast",
    diet: "vegetarian",
    ingredients: "protein powder, banana, milk, honey",
    website: "http://example.com/26",
    calories: 200,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 27,
    name: "Ribeye Steak",
    mealTime: "dinner",
    diet: "none",
    ingredients: "ribeye steak, butter, rosemary, garlic, potatoes",
    website: "http://example.com/27",
    calories: 800,
    serving: 1,
    occurrences: 0,
  },
  {
    id: 28,
    name: "Cheese Omelette",
    mealTime: "breakfast, lunch",
    diet: "vegetarian",
    ingredients: "eggs, cheddar cheese, milk, butter",
    website: "http://example.com/28",
    calories: 330,
    serving: 1,
    occurrences: 0,
  },
];

describe("filterByDietaryRestrictions", () => {
  it("filters meals by single dietary restriction (vegan)", () => {
    const result = filterByDietaryRestrictions(mockMeals, ["vegan"]);

    // Should include only vegan meals
    expect(result.length).toBe(11);
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("vegan"))
    ).toBe(true);
    expect(result.map((m) => m.id)).toContain(1); // Vegan Oatmeal Bowl
    expect(result.map((m) => m.id)).toContain(6); // Vegan Buddha Bowl
    expect(result.map((m) => m.id)).not.toContain(2); // Scrambled Eggs (vegetarian)
  });

  it("filters meals by single dietary restriction (vegetarian)", () => {
    const result = filterByDietaryRestrictions(mockMeals, ["vegetarian"]);

    // Should include vegetarian meals
    expect(result.length).toBe(9);
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("vegetarian"))
    ).toBe(true);
    expect(result.map((m) => m.id)).toContain(2); // Scrambled Eggs
    expect(result.map((m) => m.id)).toContain(8); // Margherita Pizza
  });

  it("filters meals by dietary restriction (none)", () => {
    const result = filterByDietaryRestrictions(mockMeals, ["none"]);

    // Should include meals with no dietary restrictions
    expect(result.length).toBe(8);
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("none"))
    ).toBe(true);
    expect(result.map((m) => m.id)).toContain(3); // Bacon and Eggs
    expect(result.map((m) => m.id)).toContain(7); // Chicken Caesar Salad
  });

  it("handles empty restrictions array (defaults to 'none')", () => {
    const result = filterByDietaryRestrictions(mockMeals, []);

    // Should default to "none" restriction
    expect(result.length).toBe(8);
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("none"))
    ).toBe(true);
  });

  it("is case-insensitive for dietary restrictions", () => {
    const resultUpper = filterByDietaryRestrictions(mockMeals, ["VEGAN"]);
    const resultLower = filterByDietaryRestrictions(mockMeals, ["vegan"]);
    const resultMixed = filterByDietaryRestrictions(mockMeals, ["VeGaN"]);

    expect(resultUpper.length).toBe(resultLower.length);
    expect(resultUpper.length).toBe(resultMixed.length);
    expect(resultUpper.map((m) => m.id).sort()).toEqual(
      resultLower.map((m) => m.id).sort()
    );
  });
});

describe("filterByAllergies", () => {
  it("filters out meals containing single allergen (peanut)", () => {
    const result = filterByAllergies(mockMeals, ["peanut"]);

    // Should exclude meals with peanut
    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(22); // Peanut Noodles
    expect(result.map((m) => m.id)).toContain(1); // Vegan Oatmeal Bowl (no peanut)
    expect(result.length).toBe(26); // 28 total - 2 with peanut
  });

  it("filters out meals containing multiple allergens", () => {
    const result = filterByAllergies(mockMeals, ["peanut", "shrimp"]);

    // Should exclude meals with peanut OR shrimp
    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(22); // Peanut Noodles
    expect(result.map((m) => m.id)).not.toContain(23); // Shrimp Pasta
    expect(result.length).toBe(25); // 28 total - 3 with allergens
  });

  it("handles empty allergens array (returns all meals)", () => {
    const result = filterByAllergies(mockMeals, []);

    expect(result.length).toBe(mockMeals.length);
    expect(result).toEqual(mockMeals);
  });

  it("is case-insensitive for allergens", () => {
    const resultUpper = filterByAllergies(mockMeals, ["PEANUT"]);
    const resultLower = filterByAllergies(mockMeals, ["peanut"]);
    const resultMixed = filterByAllergies(mockMeals, ["PeAnUt"]);

    expect(resultUpper.length).toBe(resultLower.length);
    expect(resultUpper.length).toBe(resultMixed.length);
    expect(resultUpper.map((m) => m.id).sort()).toEqual(
      resultLower.map((m) => m.id).sort()
    );
  });

  it("handles allergen strings with whitespace", () => {
    const result = filterByAllergies(mockMeals, ["  peanut  ", " shrimp "]);

    // Should trim and filter correctly
    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(22); // Peanut Noodles
    expect(result.map((m) => m.id)).not.toContain(23); // Shrimp Pasta
    expect(result.length).toBe(25);
  });

  it("filters partial matches in ingredient strings", () => {
    const result = filterByAllergies(mockMeals, ["almond"]);

    // Should exclude meals with almond (including "almond milk" and "almonds")
    expect(result.map((m) => m.id)).not.toContain(1); // Vegan Oatmeal Bowl (almond milk)
    expect(result.map((m) => m.id)).not.toContain(24); // Almond Crusted Chicken
    expect(result.length).toBe(26);
  });
});

describe("removeDownvotedMeals", () => {
  it("removes meals by single downvoted ID", () => {
    const result = removeDownvotedMeals(mockMeals, [1]);

    expect(result.map((m) => m.id)).not.toContain(1);
    expect(result.length).toBe(27);
  });

  it("removes meals by multiple downvoted IDs", () => {
    const result = removeDownvotedMeals(mockMeals, [1, 5, 10, 15]);

    expect(result.map((m) => m.id)).not.toContain(1);
    expect(result.map((m) => m.id)).not.toContain(5);
    expect(result.map((m) => m.id)).not.toContain(10);
    expect(result.map((m) => m.id)).not.toContain(15);
    expect(result.length).toBe(24);
  });

  it("handles empty downvoted IDs array (returns all meals)", () => {
    const result = removeDownvotedMeals(mockMeals, []);

    expect(result.length).toBe(mockMeals.length);
    expect(result).toEqual(mockMeals);
  });

  it("handles non-existent downvoted IDs gracefully", () => {
    const result = removeDownvotedMeals(mockMeals, [999, 1000]);

    // Should not remove any meals
    expect(result.length).toBe(mockMeals.length);
  });

  it("handles mix of existing and non-existing IDs", () => {
    const result = removeDownvotedMeals(mockMeals, [1, 999, 5, 1000]);

    expect(result.map((m) => m.id)).not.toContain(1);
    expect(result.map((m) => m.id)).not.toContain(5);
    expect(result.length).toBe(26);
  });
});

describe("filterByMealTime", () => {
  it("filters meals by breakfast", () => {
    const result = filterByMealTime(mockMeals, "breakfast");

    // Should include breakfast meals and multi-meal time options
    expect(result.map((m) => m.id)).toContain(1); // Vegan Oatmeal Bowl
    expect(result.map((m) => m.id)).toContain(19); // Avocado Toast (breakfast, lunch)
    expect(result.map((m) => m.id)).toContain(21); // Fruit Salad (breakfast, lunch, dinner)
    expect(result.map((m) => m.id)).toContain(28); // Cheese Omelette (breakfast, lunch)
    expect(result.map((m) => m.id)).not.toContain(6); // Vegan Buddha Bowl (lunch only)
    expect(result.length).toBe(9); // 5 breakfast + 3 multi-time with breakfast + 1 more
  });

  it("filters meals by lunch", () => {
    const result = filterByMealTime(mockMeals, "lunch");

    // Should include lunch meals and multi-meal time options
    expect(result.map((m) => m.id)).toContain(6); // Vegan Buddha Bowl
    expect(result.map((m) => m.id)).toContain(19); // Avocado Toast (breakfast, lunch)
    expect(result.map((m) => m.id)).toContain(20); // Grilled Cheese (lunch, dinner)
    expect(result.map((m) => m.id)).toContain(21); // Fruit Salad (breakfast, lunch, dinner)
    expect(result.map((m) => m.id)).not.toContain(1); // Vegan Oatmeal Bowl (breakfast only)
    expect(result.length).toBe(10); // 5 lunch + 5 multi-time with lunch
  });

  it("filters meals by dinner", () => {
    const result = filterByMealTime(mockMeals, "dinner");

    // Should include dinner meals and multi-meal time options
    expect(result.map((m) => m.id)).toContain(11); // Grilled Salmon
    expect(result.map((m) => m.id)).toContain(20); // Grilled Cheese (lunch, dinner)
    expect(result.map((m) => m.id)).toContain(21); // Fruit Salad (breakfast, lunch, dinner)
    expect(result.map((m) => m.id)).not.toContain(1); // Vegan Oatmeal Bowl (breakfast only)
    expect(result.length).toBe(11); // 9 dinner + 2 multi-time with dinner
  });

  it("filters meals by dessert", () => {
    const result = filterByMealTime(mockMeals, "dessert");

    // Should include only dessert meals
    expect(result.map((m) => m.id)).toContain(16); // Chocolate Cake
    expect(result.map((m) => m.id)).toContain(17); // Vegan Brownie
    expect(result.map((m) => m.id)).toContain(18); // Ice Cream Sundae
    expect(result.map((m) => m.id)).not.toContain(1); // Vegan Oatmeal Bowl
    expect(result.length).toBe(3);
  });

  it("correctly includes meals with comma-separated meal times", () => {
    const breakfastResult = filterByMealTime(mockMeals, "breakfast");
    const lunchResult = filterByMealTime(mockMeals, "lunch");
    const dinnerResult = filterByMealTime(mockMeals, "dinner");

    // Avocado Toast (id 19) should be in both breakfast and lunch
    expect(breakfastResult.map((m) => m.id)).toContain(19);
    expect(lunchResult.map((m) => m.id)).toContain(19);
    expect(dinnerResult.map((m) => m.id)).not.toContain(19);

    // Grilled Cheese (id 20) should be in both lunch and dinner
    expect(lunchResult.map((m) => m.id)).toContain(20);
    expect(dinnerResult.map((m) => m.id)).toContain(20);
    expect(breakfastResult.map((m) => m.id)).not.toContain(20);

    // Fruit Salad (id 21) should be in breakfast, lunch, and dinner
    expect(breakfastResult.map((m) => m.id)).toContain(21);
    expect(lunchResult.map((m) => m.id)).toContain(21);
    expect(dinnerResult.map((m) => m.id)).toContain(21);
  });
});

describe("getPreferredMeals", () => {
  it("returns meals matching single preferred ID", () => {
    const result = getPreferredMeals(mockMeals, [1]);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
    expect(result[0].name).toBe("Vegan Oatmeal Bowl");
  });

  it("returns meals matching multiple preferred IDs", () => {
    const result = getPreferredMeals(mockMeals, [1, 5, 10, 15]);

    expect(result.length).toBe(4);
    expect(result.map((m) => m.id).sort((a, b) => a - b)).toEqual([
      1, 5, 10, 15,
    ]);
  });

  it("handles empty preferred IDs array (returns empty array)", () => {
    const result = getPreferredMeals(mockMeals, []);

    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  it("handles non-existent preferred IDs gracefully", () => {
    const result = getPreferredMeals(mockMeals, [999, 1000]);

    expect(result.length).toBe(0);
    expect(result).toEqual([]);
  });

  it("handles mix of existing and non-existing IDs", () => {
    const result = getPreferredMeals(mockMeals, [1, 999, 5, 1000]);

    expect(result.length).toBe(2);
    expect(result.map((m) => m.id).sort()).toEqual([1, 5]);
  });

  it("maintains original meal order", () => {
    const result = getPreferredMeals(mockMeals, [10, 5, 1]);

    // Should return in order they appear in original array, not request order
    expect(result.map((m) => m.id)).toEqual([1, 5, 10]);
  });
});

describe("adjustServings", () => {
  it("calculates serving sizes within 20% tolerance", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 300 }, // Can reach 500 with 1.5-2 servings
      { ...mockMeals[1], calories: 250 }, // Can reach 500 with 2 servings
      { ...mockMeals[2], calories: 450 }, // Can reach 500 with 1 serving
    ];

    const result = adjustServings(testMeals, 500);

    // All returned meals should be within 20% (400-600 calories)
    result.forEach((meal) => {
      const totalCalories = meal.calories * meal.serving;
      expect(totalCalories).toBeGreaterThanOrEqual(400);
      expect(totalCalories).toBeLessThanOrEqual(600);
    });
  });

  it("picks the serving size closest to target", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 300, id: 100 }, // Target 500: 1.5 servings = 450 (diff 50)
    ];

    const result = adjustServings(testMeals, 500);

    expect(result.length).toBe(1);
    expect(result[0].serving).toBeCloseTo(1.5, 1); // Should pick 1.5 servings (450 cal)
    expect(result[0].calories * result[0].serving).toBeCloseTo(450, 1);
  });

  it("filters out meals that cannot reach target even with adjustments", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 100, id: 100 }, // Target 500: even 10 servings = 1000 (too high)
      { ...mockMeals[1], calories: 300, id: 101 }, // Can reach 500
      { ...mockMeals[2], calories: 50, id: 102 }, // Target 500: 10 servings = 500 (perfect)
    ];

    const result = adjustServings(testMeals, 500);

    // Should include meals that can reach target within tolerance
    expect(result.length).toBeGreaterThan(0);
    result.forEach((meal) => {
      const totalCalories = meal.calories * meal.serving;
      const tolerance = 500 * 0.2; // 100
      expect(totalCalories).toBeGreaterThanOrEqual(500 - tolerance);
      expect(totalCalories).toBeLessThanOrEqual(500 + tolerance);
    });
  });

  it("tests servings in 0.5 increments from 0.5 to 10", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 100, id: 100 }, // Target 500: 5 servings = 500
    ];

    const result = adjustServings(testMeals, 500);

    expect(result.length).toBe(1);
    expect(result[0].serving).toBeCloseTo(5, 1); // Should find 5 servings = 500
  });

  it("handles high calorie meals requiring small servings", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 800, id: 100 }, // Target 500: 0.5 servings = 400
    ];

    const result = adjustServings(testMeals, 500);

    expect(result.length).toBe(1);
    expect(result[0].serving).toBeGreaterThanOrEqual(0.5);
    expect(result[0].calories * result[0].serving).toBeGreaterThanOrEqual(400); // 80% of 500
    expect(result[0].calories * result[0].serving).toBeLessThanOrEqual(600); // 120% of 500
  });

  it("handles low calorie meals requiring large servings", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 60, id: 100 }, // Target 500: 8.5 servings = 510
    ];

    const result = adjustServings(testMeals, 500);

    expect(result.length).toBe(1);
    expect(result[0].serving).toBeLessThanOrEqual(10);
    expect(result[0].calories * result[0].serving).toBeGreaterThanOrEqual(400);
    expect(result[0].calories * result[0].serving).toBeLessThanOrEqual(600);
  });

  it("validates 20% tolerance boundary", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 300, id: 100 },
      { ...mockMeals[1], calories: 400, id: 101 },
      { ...mockMeals[2], calories: 500, id: 102 },
    ];

    const target = 500;
    const result = adjustServings(testMeals, target);

    result.forEach((meal) => {
      const totalCalories = meal.calories * meal.serving;
      const lowerBound = target * 0.8; // 400
      const upperBound = target * 1.2; // 600

      expect(totalCalories).toBeGreaterThanOrEqual(lowerBound);
      expect(totalCalories).toBeLessThanOrEqual(upperBound);
    });
  });

  it("modifies the serving property of returned meals", () => {
    const testMeals: Meal[] = [
      { ...mockMeals[0], calories: 300, id: 100, serving: 1 },
    ];

    const result = adjustServings(testMeals, 500);

    expect(result.length).toBe(1);
    expect(result[0].serving).not.toBe(1); // Should be modified from default
    expect(result[0].serving).toBeCloseTo(1.5, 1); // Should be ~1.5 for 450 calories
  });
});

describe("applyAllFilters", () => {
  it("applies dietary restrictions filter", () => {
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: ["vegan"],
    });

    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("vegan"))
    ).toBe(true);
    expect(result.length).toBe(11);
  });

  it("applies allergy filter", () => {
    const result = applyAllFilters(mockMeals, {
      allergyIngredients: ["peanut"],
    });

    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(22); // Peanut Noodles
    expect(result.length).toBe(26);
  });

  it("applies downvoted meals filter", () => {
    const result = applyAllFilters(mockMeals, {
      downvotedIds: [1, 5, 10],
    });

    expect(result.map((m) => m.id)).not.toContain(1);
    expect(result.map((m) => m.id)).not.toContain(5);
    expect(result.map((m) => m.id)).not.toContain(10);
    expect(result.length).toBe(25);
  });

  it("applies meal time filter", () => {
    const result = applyAllFilters(mockMeals, {
      mealTime: "breakfast",
    });

    expect(
      result.every((meal) => meal.mealTime.toLowerCase().includes("breakfast"))
    ).toBe(true);
    expect(result.length).toBe(9);
  });

  it("applies serving adjustment based on target calories", () => {
    const result = applyAllFilters(mockMeals, {
      targetCalories: 500,
    });

    // All meals should have adjusted servings within 20% of 500 (400-600)
    result.forEach((meal) => {
      const totalCalories = meal.calories * meal.serving;
      expect(totalCalories).toBeGreaterThanOrEqual(400);
      expect(totalCalories).toBeLessThanOrEqual(600);
    });
  });

  it("applies multiple filters in correct order", () => {
    // Order: dietary -> allergies -> downvoted -> mealTime -> targetCalories
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: ["vegan"],
      allergyIngredients: ["peanut"],
      downvotedIds: [1],
      mealTime: "breakfast",
      targetCalories: 300,
    });

    // Should be vegan breakfast meals without peanut, not downvoted, with ~300 calories
    result.forEach((meal) => {
      expect(meal.diet.toLowerCase()).toContain("vegan");
      expect(meal.ingredients.toLowerCase()).not.toContain("peanut");
      expect(meal.id).not.toBe(1);
      expect(meal.mealTime.toLowerCase()).toContain("breakfast");

      const totalCalories = meal.calories * meal.serving;
      expect(totalCalories).toBeGreaterThanOrEqual(240); // 80% of 300
      expect(totalCalories).toBeLessThanOrEqual(360); // 120% of 300
    });
  });

  it("validates filter order: dietary restrictions applied first", () => {
    // Apply vegan filter first, then check if subsequent filters work on vegan subset
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: ["vegan"],
      mealTime: "breakfast",
    });

    // Should only have vegan breakfast meals
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("vegan"))
    ).toBe(true);
    expect(
      result.every((meal) => meal.mealTime.toLowerCase().includes("breakfast"))
    ).toBe(true);
    expect(result.map((m) => m.id)).toContain(1); // Vegan Oatmeal Bowl
    expect(result.map((m) => m.id)).toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(2); // Scrambled Eggs (vegetarian)
  });

  it("validates filter order: allergies applied after dietary restrictions", () => {
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: ["vegan"],
      allergyIngredients: ["peanut"],
    });

    // Should have vegan meals without peanut
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("vegan"))
    ).toBe(true);
    expect(
      result.every((meal) => !meal.ingredients.toLowerCase().includes("peanut"))
    ).toBe(true);
    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast (vegan but has peanut)
    expect(result.map((m) => m.id)).toContain(1); // Vegan Oatmeal Bowl (vegan, no peanut)
  });

  it("validates filter order: downvoted applied after allergies", () => {
    const result = applyAllFilters(mockMeals, {
      allergyIngredients: ["peanut"],
      downvotedIds: [1, 6],
    });

    // Should exclude peanut meals and downvoted meals
    expect(result.map((m) => m.id)).not.toContain(1); // Downvoted
    expect(result.map((m) => m.id)).not.toContain(4); // Peanut Butter Toast
    expect(result.map((m) => m.id)).not.toContain(6); // Downvoted
    expect(result.map((m) => m.id)).not.toContain(22); // Peanut Noodles
  });

  it("validates filter order: mealTime applied after downvoted", () => {
    const result = applyAllFilters(mockMeals, {
      downvotedIds: [1, 2],
      mealTime: "breakfast",
    });

    // Should have breakfast meals excluding downvoted
    expect(
      result.every((meal) => meal.mealTime.toLowerCase().includes("breakfast"))
    ).toBe(true);
    expect(result.map((m) => m.id)).not.toContain(1); // Vegan Oatmeal Bowl (downvoted)
    expect(result.map((m) => m.id)).not.toContain(2); // Scrambled Eggs (downvoted)
    expect(result.map((m) => m.id)).toContain(3); // Bacon and Eggs (breakfast, not downvoted)
  });

  it("validates filter order: targetCalories applied last", () => {
    const result = applyAllFilters(mockMeals, {
      mealTime: "lunch",
      targetCalories: 500,
    });

    // Should have lunch meals with adjusted servings for ~500 calories
    result.forEach((meal) => {
      expect(meal.mealTime.toLowerCase()).toContain("lunch");

      const totalCalories = meal.calories * meal.serving;
      expect(totalCalories).toBeGreaterThanOrEqual(400);
      expect(totalCalories).toBeLessThanOrEqual(600);
    });
  });

  it("returns expected list with complex filter combination", () => {
    // Scenario: Vegan dinner, no chickpeas, not downvoted, ~500 calories
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: ["vegan"],
      allergyIngredients: ["chickpeas"],
      downvotedIds: [12],
      mealTime: "dinner",
      targetCalories: 500,
    });

    // Expected: Should have vegan dinner meals without chickpeas, not id 12, ~500 cal
    result.forEach((meal) => {
      expect(meal.diet.toLowerCase()).toContain("vegan");
      expect(meal.ingredients.toLowerCase()).not.toContain("chickpeas");
      expect(meal.id).not.toBe(12);
      expect(meal.mealTime.toLowerCase()).toContain("dinner");

      const totalCalories = meal.calories * meal.serving;
      expect(totalCalories).toBeGreaterThanOrEqual(400);
      expect(totalCalories).toBeLessThanOrEqual(600);
    });

    // Should NOT include id 6 (Buddha Bowl - has chickpeas)
    expect(result.map((m) => m.id)).not.toContain(6);
    // Should NOT include id 12 (Vegetable Stir Fry - downvoted)
    expect(result.map((m) => m.id)).not.toContain(12);
    // Should NOT include id 15 (Chickpea Curry - has chickpeas)
    expect(result.map((m) => m.id)).not.toContain(15);
  });

  it("handles all filters with empty/undefined values gracefully", () => {
    const result = applyAllFilters(mockMeals, {
      dietaryRestrictions: [],
      allergyIngredients: [],
      downvotedIds: [],
    });

    // With empty arrays, should return meals filtered only by defaults
    // dietaryRestrictions: [] defaults to ["none"]
    expect(result.length).toBe(8);
    expect(
      result.every((meal) => meal.diet.toLowerCase().includes("none"))
    ).toBe(true);
  });

  it("returns all meals when no filters are specified", () => {
    const result = applyAllFilters(mockMeals, {});

    // No filters applied - should return all meals since dietaryRestrictions is not provided
    expect(result.length).toBe(28);
  });
});
