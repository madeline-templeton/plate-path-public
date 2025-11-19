import { he } from "zod/v4/locales";
import { UserConstraints } from "../../globals";
import { Planner } from "../../globals";
import { baseCalorieCalculator } from "./mealGenerationHelpers";
import { exerciseAdjustedCalorieCalculator } from "./mealGenerationHelpers";


export async function mealController(constraints: UserConstraints): 
    Promise<{success: boolean, planner?: Planner}> {
    try{
        const baseCalories = baseCalorieCalculator(constraints);

        const adjustedCalories = exerciseAdjustedCalorieCalculator(constraints, baseCalories);


    } catch(error){

    }

    return {success: true}
}


