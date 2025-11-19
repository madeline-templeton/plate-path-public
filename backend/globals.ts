import z from "zod";

export const userConstraintsSchema = z.object({
    age: z.number().positive(),
    sex: z.enum(["M", "F"]),
    height: z.object({
        value: z.array(z.number().positive()),
        unit: z.enum(["cm", "ft-in", "inch", "m"])
    }),
    weight: z.object({
        value: z.number().positive(),
        unit: z.enum(["kg", "lb"])
    }),
    activityLevel: z.enum(["Not active", "Lightly active", "Moderately active", "Active", "Very active"]),
    weightGoal: z.enum(["Extreme weight loss", "Weight loss", "Maintenance", "Weight gain", "Extreme weight gain"]),
    dietaryRestrictions: z.array(z.string()),
    excludeIngredients: z.array(z.string()),
    weeks: z.union([z.literal(1), z.literal(2), z.literal(4)])
});



export const recipeSchema = z.object({
    instructions: z.string(),
    video: z.string(),
    ingredients: z.string()

});

export const mealSchema = z.object({
    name: z.string(),
    id: z.coerce.number(),
    category: z.string(),
    calories: z.number(),
    recipe: recipeSchema
});




export const daySchema = z.object({
    date: z.string(),
    breakfast: mealSchema,
    lunch: z.union([mealSchema, z.object({main: mealSchema, dessert: mealSchema})]),
    dinner: z.union([mealSchema, z.object({main: mealSchema, dessert: mealSchema})])
});

export const plannerSchema = z.object({
    userId: z.string(),
    startDate: z.string(),
    weeks: z.union([z.literal(1), z.literal(2), z.literal(4)]),
    meals: z.array(daySchema)
})

export const algorithmInputSchema = z.object({
    calories: z.number(),
    dietaryRestrictions: z.array(z.string()),
    excludeIngredients: z.array(z.string()),
});



export type UserConstraints = z.infer<typeof userConstraintsSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type Day = z.infer<typeof daySchema>;
export type Planner = z.infer<typeof plannerSchema>;
export type AlgorithmInput = z.infer<typeof algorithmInputSchema>;

export type mealPlanningAlgorithm = (constraints: AlgorithmInput) => Promise<Meal>;