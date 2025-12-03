import { mealAlgorithm } from "./mealGenerationAlgorithm";
import { calendarDate } from "../../globals";

/**
 * Simple test runner for the meal generation algorithm
 * Run with: npm run dev (or tsx src/mealGeneration/testAlgorithm.ts)
 */
async function testMealAlgorithm() {
  console.log("🧪 Testing Meal Generation Algorithm\n");

  try {
    // Test 1: Basic 3-day plan with no restrictions
    // Note: Using 400 cal target which works across breakfast/lunch/dinner in our sample data
    console.log("Test 1: Basic 3-day plan (no restrictions)");
    console.log("=".repeat(50));

    const startDate: calendarDate = {
      day: "1",
      month: "12",
      year: "2025",
    };

    const plan1 = await mealAlgorithm(
    
      3, // 3 days
      1200, // 1200 cal per day
      ["vegan"], // no dietary restrictions
      [], // no allergies
      [], // no downvoted meals
      [], // no preferred meals
      startDate
    );

    console.log(`✅ Generated ${plan1.length} days`);
    plan1.forEach((day, index) => {
      console.log(
        `\nDay ${index + 1} (${day.date.month}/${day.date.day}/${
          day.date.year
        }):`
      );
      console.log(
        `  Breakfast: ${day.breakfast.name} diet (${day.breakfast.diet}) (${day.breakfast.calories} cal) ingredients: ${day.breakfast.ingredients}`
      );
      console.log(`  Lunch: ${day.lunch.name} diet (${day.lunch.diet}) (${day.lunch.calories} cal) ingredients: ${day.lunch.ingredients}`);
      console.log(`  Dinner: ${day.dinner.name} diet (${day.dinner.diet}) (${day.dinner.calories} cal) ingredients: ${day.dinner.ingredients}`);
    });
} catch (error) {
    console.error("\n❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("Stack:", error.stack);
    }
    process.exit(1);
  }
}

//     // Test 2: With dietary restrictions
//     console.log("\n\nTest 2: 2-day plan with dietary restrictions");
//     console.log("=".repeat(50));

//     const plan2 = await mealAlgorithm(
//       2,
//       400, // 400 cal per meal
//       ["beef", "pork"], // exclude beef and pork (less restrictive)
//       [],
//       [],
//       [],
//       startDate
//     );

//     console.log(`✅ Generated ${plan2.length} days (excluding eggs & chicken)`);
//     plan2.forEach((day, index) => {
//       console.log(`\nDay ${index + 1}:`);
//       console.log(`  Breakfast: ${day.breakfast.name}`);
//       console.log(`  Lunch: ${day.lunch.name}`);
//       console.log(`  Dinner: ${day.dinner.name}`);

//       // Verify no restricted ingredients
//       const allIngredients = [
//         day.breakfast.ingredients,
//         day.lunch.ingredients,
//         day.dinner.ingredients,
//       ]
//         .join(" ")
//         .toLowerCase();

//       if (allIngredients.includes("beef") || allIngredients.includes("pork")) {
//         console.log("  ⚠️  WARNING: Found restricted ingredient!");
//       }
//     });

//     // Test 3: With preferences
//     console.log("\n\nTest 3: 2-day plan with preferred meals");
//     console.log("=".repeat(50));

//     const plan3 = await mealAlgorithm(
//       2,
//       400, // 400 cal per meal
//       [],
//       [],
//       [],
//       [1, 3, 5], // prefer meal IDs 1, 3, 5
//       startDate
//     );

//     console.log(`✅ Generated ${plan3.length} days (with preferences)`);
//     const preferredIds = new Set([1, 3, 5]);
//     let preferredCount = 0;

//     plan3.forEach((day, index) => {
//       console.log(`\nDay ${index + 1}:`);
//       const meals = [day.breakfast, day.lunch, day.dinner];
//       meals.forEach((meal) => {
//         const isPreferred = preferredIds.has(meal.id);
//         if (isPreferred) preferredCount++;
//         console.log(
//           `  ${meal.mealTime}: ${meal.name} ${isPreferred ? "⭐" : ""}`
//         );
//       });
//     });

//     console.log(
//       `\n${preferredCount} out of ${
//         plan3.length * 3
//       } meals were from preferred list`
//     );

//     // Test 4: Date incrementing
//     console.log("\n\nTest 4: Verify date incrementing");
//     console.log("=".repeat(50));

//     const plan4 = await mealAlgorithm(
//       5,
//       400, // 400 cal per meal
//       [],
//       [],
//       [],
//       [],
//       { day: "28", month: "2", year: "2024" } // leap year test
//     );

//     console.log("✅ Date sequence:");
//     plan4.forEach((day, index) => {
//       console.log(
//         `  Day ${index + 1}: ${day.date.month}/${day.date.day}/${day.date.year}`
//       );
//     });

//     // Test 5: Variety check (occurrences)
//     console.log("\n\nTest 5: Meal variety check (7-day plan)");
//     console.log("=".repeat(50));

//     const plan5 = await mealAlgorithm(
//       7,
//       400, // 400 cal per meal
//       [],
//       [],
//       [],
//       [],
//       startDate
//     );

//     const mealCounts = new Map<number, number>();
//     plan5.forEach((day) => {
//       [day.breakfast, day.lunch, day.dinner].forEach((meal) => {
//         mealCounts.set(meal.id, (mealCounts.get(meal.id) || 0) + 1);
//       });
//     });

//     console.log("✅ Meal frequency distribution:");
//     Array.from(mealCounts.entries())
//       .sort((a, b) => b[1] - a[1])
//       .forEach(([id, count]) => {
//         const meal = plan5
//           .flatMap((d) => [d.breakfast, d.lunch, d.dinner])
//           .find((m) => m.id === id);
//         console.log(
//           `  ID ${id} (${meal?.name}): ${count} times ${count > 4 ? "⚠️" : ""}`
//         );
//       });

//     console.log("\n✅ All tests completed successfully!\n");
//   } catch (error) {
//     console.error("\n❌ Test failed:", error);
//     if (error instanceof Error) {
//       console.error("Stack:", error.stack);
//     }
//     process.exit(1);
//   }
// }

// Run tests
testMealAlgorithm();
