import { calendarDate, Day, Meal } from "../../globals";

export async function mealAlgorithm(
    planLenghth: number,
    mealCalories: number, 
    dietaryRestrictions: string[], mealFrequency: Map<Meal, number>[], date: calendarDate): Promise<Day[]>{

// Get the meals with/in a specified calorie range from CSV
// Narrow the list to those in the correct category (lunch, breakfast, dinner) DONT DO THIS STEP
// Remove meals downvoted, violating allergy restrictions, or violating dietary restrictions. 
// Run pickMeal

// pickMeal{
// 	Candidates: meal[]
// 	Preferred: meal[]
// 	} promise Meal: 
		
// 	Generate random number 
// 	60% -> choose randomly from candidates 
// 	40% -> choose randomly from preferred 
// 	*if chosen meal occurs more than four times, run again 
// 	*limit to 10 reruns, then sacrifice variety to deliver plan for the user
// Return meal_id

// Note that type Meal will be: 
// Meal{ 
// 	id: number
// 	Number of occurrences : number
// }

// Fill out a day object by running this three times so that day is: 
// Day{ 
// Breakfast: id
// Lunch: id
// Dinner: id
// Desert? : id 
// } 
// Finally, return a list of days representing the meals 
    const lowerBound = Math.floor(mealCalories / 100) * 100;
    const upperBound = lowerBound + 99;
    const planLength = planLenghth; // number of days in plan
    let plan : Day[] = [];
    
    // possible meals = list of tuples of meals from CSV 
    // preffered meals = from user 
    let possibleMeals: Meal[] = []; // get from CSV based on calorie range and dietary restrictions
    let mealFrequencyMap: Map<number, number> = new Map();
    const preferredMeals: Meal[] = []; // get from user profile based on upvotes 
    // filter out meals based on downvotes, allergies, dietary restrictions
    for (let i: number = 0; i < planLength; i++) {
        const breakfast = await pickMeal(possibleMeals, preferredMeals, "breakfast");
        const lunch = await pickMeal(possibleMeals, preferredMeals, "lunch");
        const dinner = await pickMeal(possibleMeals, preferredMeals, "dinner");    
        let dayPlan = {
            date: date, // NEED TO INCREMENT DATE 
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner
        };
        plan.push(dayPlan);
    }

    return plan; 
    











    // return {
    //     date: date,
    //     breakfast: {
    //         name: "Rømmegrøt – Norwegian Sour Cream Porridge",
    //         id: 53118,
    //         category: "Breakfast",
    //         calories: 550,
    //         recipe: {
    //             instructions: "▢\nCook the sour cream in a covered saucepan on medium heat for about 5 minutes.\n▢\nTurn down the heat and add half of the flour and stir well with a whisk. Once the flour is fully incorporated, let the mixture continue to cook, stirring occasionally, until fat starts to release. Use a spoon to gather as much of the fat as you can in a small bowl, saving for later. (Don't worry if you can't get any fat – in that case you can add butter later.)\n▢\nWhisk in the rest of the flour and then slowly add the milk, whisking constantly to avoid lumps. Let the porridge continue to cook on low heat for 5 minutes and then add salt.\n▢\nServe with sugar, cinnamon, and the fat from the porridge. If you're using lower fat sour cream you can top the rømmegrøt with some butter instead.",
    //             ingredients: "Full fat sour cream: 2 cups ; Flour: 3/4 cup; Milk: 2 cups ; Salt: 1 tsp; Sugar: Sprinkling; Cinnamon: Sprinkling; Butter: To taste",
    //             video: "https://www.youtube.com/watch?v=v4rIJOWXM3w"
    //         }
    //     },
    //     lunch: {
    //         name: "Brown Stew Chicken",
    //         id: 52940,
    //         category: "Chicken",
    //         calories: 650,
    //         recipe: {
    //             instructions: "Combine tomato, scallion, onion, garlic, pepper, thyme, pimento and soy sauce in a large bowl with the chicken pieces. Cover and marinate at least one hour.\nHeat oil in a dutch pot or large saucepan. Shake off the seasonings as you remove each piece of chicken from the marinade. Reserve the marinade for sauce.\nLightly brown the chicken a few pieces at a time in very hot oil. Place browned chicken pieces on a plate to rest while you brown the remaining pieces.\nDrain off excess oil and return the chicken to the pan. Pour the marinade over the chicken and add the carrots. Stir and cook over medium heat for 10 minutes.\nMix flour and coconut milk and add to stew, stirring constantly. Turn heat down to minimum and cook another 20 minutes or until tender.",
    //             ingredients: "Chicken: 1 whole; Tomato: 1 chopped; Onions: 2 chopped; Garlic Clove: 2 chopped; Red Pepper: 1 chopped; Carrots: 1 chopped; Lime: 1; Thyme: 2 tsp; Allspice: 1 tsp ; Soy Sauce: 2 tbs; Cornstarch: 2 tsp; Coconut Milk: 2 cups ; Vegetable Oil: 1 tbs",
    //             video: "https://www.youtube.com/watch?v=_gFB1fkNhXs"
    //         }
    //     },
    //     dinner: {
    //         name: "Egg Drop Soup",
    //         id: 52955,
    //         category: "Vegetarian",
    //         calories: 650,
    //         recipe: {
    //             instructions: "In a wok add chicken broth and wait for it to boil.\nNext add salt, sugar, white pepper, sesame seed oil.\nWhen the chicken broth is boiling add the vegetables to the wok.\nTo thicken the sauce, whisk together 1 Tablespoon of cornstarch and 2 Tablespoon of water in a bowl and slowly add to your soup until it's the right thickness.\nNext add 1 egg slightly beaten with a knife or fork and add it to the soup slowly and stir for 8 seconds\nServe the soup in a bowl and add the green onions on top.",
    //             ingredients: "Chicken Stock: 3 cups ; Salt: 1/4 tsp; Sugar: 1/4 tsp; Pepper: pinch; Sesame Seed Oil: 1 tsp ; Peas: 1/3 cup; Mushrooms: 1/3 cup; Cornstarch: 1 tbs; Water: 2 tbs; Spring Onions: 1/4 cup",
    //             video: "https://www.youtube.com/watch?v=9XpzHm9QpZg"
    //         }
    //     }
    // }
}

export async function pickMeal(
    Candidates: Meal[],
	Preferred: Meal[], 
    MealTime: string): Promise<Meal> {
    // Generate random number 
    // 60% -> choose randomly from candidates 
    // 40% -> choose randomly from preferred 
    // *if chosen meal occurs more than four times, run again 
    // *limit to 10 reruns, then sacrifice variety to deliver plan for the user
    let selectedMeal: Meal;
    selectedMeal = Candidates[0]; // default value to avoid uninitialized error
    for (let i = 0; i < 10; i++) {
    const randomNumber: number = Math.random();
    if (randomNumber < 0.6) {
        const randomIndex = Math.floor(Math.random() * Candidates.length);
        selectedMeal = Candidates[randomIndex];
    }
    else {
        const randomIndex = Math.floor(Math.random() * Preferred.length);
        selectedMeal = Preferred[randomIndex];
    }
    if (selectedMeal.occurrences < 4 || i >= 9) { // if meal has occurred less than 4 times, or we are on the 9th iteration return it (limit reruns to 10)
        selectedMeal.occurrences += 1; // increment occurrence count
        break
    }
}
    return selectedMeal;
    }

export async function mockMealAlgorithm(
    dailyCalories: number, 
    dietaryRestrictions: string[], 
    mealFrequency: Map<Meal, number>[],
    date: calendarDate): Promise<Day>{
    return {
        date: date,
        breakfast: {
            name: "Rømmegrøt – Norwegian Sour Cream Porridge",
            id: 53118,
            category: "Breakfast",
            calories: 550,
            recipe: {
                instructions: "▢\nCook the sour cream in a covered saucepan on medium heat for about 5 minutes.\n▢\nTurn down the heat and add half of the flour and stir well with a whisk. Once the flour is fully incorporated, let the mixture continue to cook, stirring occasionally, until fat starts to release. Use a spoon to gather as much of the fat as you can in a small bowl, saving for later. (Don't worry if you can't get any fat – in that case you can add butter later.)\n▢\nWhisk in the rest of the flour and then slowly add the milk, whisking constantly to avoid lumps. Let the porridge continue to cook on low heat for 5 minutes and then add salt.\n▢\nServe with sugar, cinnamon, and the fat from the porridge. If you're using lower fat sour cream you can top the rømmegrøt with some butter instead.",
                ingredients: "Full fat sour cream: 2 cups ; Flour: 3/4 cup; Milk: 2 cups ; Salt: 1 tsp; Sugar: Sprinkling; Cinnamon: Sprinkling; Butter: To taste",
                video: "https://www.youtube.com/watch?v=v4rIJOWXM3w"
            }
        },
        lunch: {
            name: "Brown Stew Chicken",
            id: 52940,
            category: "Chicken",
            calories: 650,
            recipe: {
                instructions: "Combine tomato, scallion, onion, garlic, pepper, thyme, pimento and soy sauce in a large bowl with the chicken pieces. Cover and marinate at least one hour.\nHeat oil in a dutch pot or large saucepan. Shake off the seasonings as you remove each piece of chicken from the marinade. Reserve the marinade for sauce.\nLightly brown the chicken a few pieces at a time in very hot oil. Place browned chicken pieces on a plate to rest while you brown the remaining pieces.\nDrain off excess oil and return the chicken to the pan. Pour the marinade over the chicken and add the carrots. Stir and cook over medium heat for 10 minutes.\nMix flour and coconut milk and add to stew, stirring constantly. Turn heat down to minimum and cook another 20 minutes or until tender.",
                ingredients: "Chicken: 1 whole; Tomato: 1 chopped; Onions: 2 chopped; Garlic Clove: 2 chopped; Red Pepper: 1 chopped; Carrots: 1 chopped; Lime: 1; Thyme: 2 tsp; Allspice: 1 tsp ; Soy Sauce: 2 tbs; Cornstarch: 2 tsp; Coconut Milk: 2 cups ; Vegetable Oil: 1 tbs",
                video: "https://www.youtube.com/watch?v=_gFB1fkNhXs"
            }
        },
        dinner: {
            name: "Egg Drop Soup",
            id: 52955,
            category: "Vegetarian",
            calories: 650,
            recipe: {
                instructions: "In a wok add chicken broth and wait for it to boil.\nNext add salt, sugar, white pepper, sesame seed oil.\nWhen the chicken broth is boiling add the vegetables to the wok.\nTo thicken the sauce, whisk together 1 Tablespoon of cornstarch and 2 Tablespoon of water in a bowl and slowly add to your soup until it's the right thickness.\nNext add 1 egg slightly beaten with a knife or fork and add it to the soup slowly and stir for 8 seconds\nServe the soup in a bowl and add the green onions on top.",
                ingredients: "Chicken Stock: 3 cups ; Salt: 1/4 tsp; Sugar: 1/4 tsp; Pepper: pinch; Sesame Seed Oil: 1 tsp ; Peas: 1/3 cup; Mushrooms: 1/3 cup; Cornstarch: 1 tbs; Water: 2 tbs; Spring Onions: 1/4 cup",
                video: "https://www.youtube.com/watch?v=9XpzHm9QpZg"
            }
        }
    }


}

