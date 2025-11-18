import { UserConstraints } from "../../globals";
import { Planner } from "../../globals";


export async function mealController(constraints: UserConstraints): 
    Promise<{success: boolean, planner?: Planner}> {
    try{
        if (user)

    } catch(error){

    }

}


function normaliseData(constraints: UserConstraints){
    let height = constraints.height.value[0];
    let weight = constraints.weight.value;
    let activityLevelMultiplier = 1.2;

    // Normalise the height to cm
    if (constraints.height.unit === "ft-in"){
        height = (height * 30.48) + (constraints.height.value[1] * 2.54);
    } 
    else if (constraints.height.unit === "inch") {
        height = (height * 2.54);
    }
    else if (constraints.height.unit === "m"){
        height = (height * 100);
    }

    // Normalise weight to kg
    if (constraints.weight.unit === "lb"){
        weight = (weight * 0.453592);
    }

    // Normalise activity level
    if (constraints.activityLevel === "Lightly active"){
        activityLevelMultiplier = 1.375;
    }
    else if (constraints.activityLevel === "Moderately active"){
        activityLevelMultiplier = 1.55;
    }
    else if (constraints.activityLevel === "Active"){
        activityLevelMultiplier = 1.725;
    }
    else if (constraints.activityLevel === "Very active"){
        activityLevelMultiplier = 1.9;
    }


}

// For reference
// export const userConstraintsSchema = z.object({
//     age: z.number().positive(),
//     height: z.object({
//         value: z.array(z.number().positive()),
//         unit: z.enum(["cm", "ft-in", "inches", "m"])
//     }),
//     weight: z.object({
//         value: z.number().positive(),
//         unit: z.enum(["kg", "lb"])
//     }),
//     activityLevel: z.enum(["Not active", "Lightly active", "Moderately active", "Active", "Very active"]),
//     weightGoal: z.enum(["Extreme weight loss", "Weight loss", "Maintenance", "Weight gain ", "Extreme weight gain "]),
//     dietaryRestrictions: z.array(z.string()),
//     excludeIngredients: z.array(z.string()),
//     weeks: z.union([z.literal(1), z.literal(2), z.literal(4)])
// });
