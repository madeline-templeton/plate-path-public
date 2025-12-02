import { he } from "zod/v4/locales";
import { UserConstraints } from "../../globals";
import { Planner, Meal } from "../../globals";
import { exerciseAdjustedCalorieCalculator, calculateDateForDay, baseCalorieCalculator } from "./mealGenerationHelpers";
import { mealAlgorithm, mockMealAlgorithm } from "./mealGenerationAlgorithm";
import { console } from "inspector";


const mealFrequency: Map<Meal, number> = new Map(); 

export async function mealController(constraints: UserConstraints): 
    Promise<{success: boolean, planner?: Planner, error?: any}> {
    try{
        const weeks = constraints.weeks;
        // Compute the base calories
        const baseCalories = baseCalorieCalculator(constraints);

        // Compute the adjusted calories
        const adjustedCalories = exerciseAdjustedCalorieCalculator(constraints, baseCalories);

        // Initialise our planner to return
        const planner: Planner = {
            userId: "000",  
            weeks: weeks, 
            meals: [],
            startDate: {
                day: constraints.date.day,
                month: constraints.date.month,
                year: constraints.date.year
            }
        }

        const weeklyFrequency = new Array(weeks).fill(mealFrequency);
        
        const days = weeks * 7
        for (let i = 0; i < days; i++){
            const currentDate = calculateDateForDay(constraints.date, i)

            const day = await mockMealAlgorithm(adjustedCalories, 
                constraints.dietaryRestrictions, weeklyFrequency, currentDate);

            planner.meals.push(day);
        }

        return {success: true, planner: planner}


    } catch(error){
        console.error("Error during planner generation", error);
        return {success: false, error: error}
    }
}




