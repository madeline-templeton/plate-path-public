import e from "express";
import { UserConstraints } from "../../globals";



export function baseCalorieCalculator(constraints: UserConstraints): number{
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

    let calories = (10*weight) + (6.25*height) - (5*constraints.age);

    if (constraints.sex === "M"){
        calories += 5;
    }
    else {
        calories -= 161;
    }

    return calories;

}




export function exerciseAdjustedCalorieCalculator(constraints: UserConstraints, baseCalories: number): number{
    let adjustedCalories = baseCalories;

    switch (constraints.weightGoal){

        case "Extreme weight loss":
            if (baseCalories < 1600){
                adjustedCalories -= 50;
            } 
            else if (baseCalories >= 1600 && baseCalories < 2000){
                if (baseCalories < 1800){
                    adjustedCalories = 1550;
                }
                else{
                    adjustedCalories -= 250;
                }
            } 
            else if (baseCalories >= 2000 && baseCalories < 2500){
                adjustedCalories -= 300;
            }
            else if (baseCalories >= 2500 && baseCalories < 3000){
                adjustedCalories -= 400;
            }
            else if (baseCalories >= 3000){
                adjustedCalories -= 500;
            }
            break;

        case "Weight loss":
            if (baseCalories < 1600){
                adjustedCalories -= 25;
            } 
            else if (baseCalories >= 1600 && baseCalories < 2000){
                if (baseCalories < 1700){
                    adjustedCalories = 1575;
                }
                else{
                    adjustedCalories -= 125;
                }
            } 
            else if (baseCalories >= 2000 && baseCalories < 2500){
                adjustedCalories -= 150;
            }
            else if (baseCalories >= 2500 && baseCalories < 3000){
                adjustedCalories -= 200;
            }
            else if (baseCalories >= 3000){
                adjustedCalories -= 250;
            }
            break;

        case "Weight gain":
            if (baseCalories < 1600){
                adjustedCalories += 50;
            } 
            else if (baseCalories >= 1600 && baseCalories < 2000){
                adjustedCalories += 125;
            } 
            else {
                adjustedCalories += 150;
            }
            break;
        case "Extreme weight gain":
            if (baseCalories < 1600){
                adjustedCalories += 100;
            } 
            else if (baseCalories >= 1600 && baseCalories < 2000){
                adjustedCalories += 250;
            } 
            else {
                adjustedCalories += 300;
            }
            break;
    }

    return adjustedCalories;
}

