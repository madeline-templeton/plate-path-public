import { he } from "zod/v4/locales";
import { UserConstraints } from "../../globals";
import { Planner, Meal } from "../../globals";
import { exerciseAdjustedCalorieCalculator, calculateDateForDay, baseCalorieCalculator } from "./mealGenerationHelpers";
import { mealAlgorithm, mockMealAlgorithm } from "./mealGenerationAlgorithm";


const mealFrequency: Map<Meal, number> = new Map(); 

export async function mealController(constraints: UserConstraints): 
    Promise<{success: boolean, planner?: Planner, error?: any}> {
    try{
        const weeks = constraints.weeks;
        const days = weeks * 7;
        
        // Compute the base calories
        const baseCalories = baseCalorieCalculator(constraints);
        console.log(`[mealController] Base calories: ${baseCalories}`);

        // Compute the adjusted calories
        const adjustedCalories = exerciseAdjustedCalorieCalculator(constraints, baseCalories);
        console.log(`[mealController] Adjusted calories (to pass to algorithm): ${adjustedCalories}`);

        // Call the meal algorithm to generate the meal plan
        const generatedMeals = await mealAlgorithm (
            days,                                // planLength: number of days
            adjustedCalories,                    // totalCalories per day
            constraints.dietaryRestrictions,     // dietaryRestrictions array
            [],                                  // allergyIngredients (empty for now, can be added later)
            constraints.downvotedMealIds,        // downvotedMealIds (empty for now)
            constraints.preferredMealIds,        // preferredMealIds (empty for now)
            constraints.date                     // startDate
        );

        // Initialise our planner to return
        const planner: Planner = {
            userId: constraints.userId,  
            weeks: weeks, 
            meals: generatedMeals,
            startDate: {
                day: constraints.date.day,
                month: constraints.date.month,
                year: constraints.date.year
            }
        }

        return {success: true, planner: planner}


    } catch(error: any){
        console.error("Error during planner generation", error);
        const errorMessage = error.message || "Unknown error occurred";
        return {success: false, error: { message: errorMessage, details: error }}
    }
}




