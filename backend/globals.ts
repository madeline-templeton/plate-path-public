import z from "zod";

export const userConstraintsSchema = z.object({
    userId: z.coerce.string(),
    age: z.coerce.number().positive(),
    sex: z.enum(["M", "F"]),
    height: z.object({
        value: z.array(z.coerce.number().nonnegative()),
        unit: z.enum(["cm", "ft-in", "inch", "m"])
    }),
    weight: z.object({
        value: z.coerce.number().positive(),
        unit: z.enum(["kg", "lb"])
    }),
    activityLevel: z.enum(["sedentary","not-active", "lightly-active", "moderately-active", "active", "very-active"]),
    weightGoal: z.enum(["extreme-loss", "weight-loss", "maintain", "weight-gain", "extreme-gain"]),
    dietaryRestrictions: z.array(z.string()),
    // excludeIngredients: z.array(z.string()),,
    downvotedMealIds: z.array(z.coerce.number()),
    preferredMealIds: z.array(z.coerce.number()),
    weeks: z.coerce.number().refine((val) => [1, 2, 4].includes(val), {
        message: "weeks must be 1, 2, or 4"
    }),
    date: z.object({
        day: z.string(),
        month: z.string(),
        year: z.string()
    })
});



export const mealSchema = z.object({
    id: z.coerce.number(),
    name: z.string(),
    mealTime: z.enum(["breakfast", "lunch", "dinner", "dessert"]),
    diet: z.string(),
    ingredients: z.string(),
    website: z.string(),
    calories: z.coerce.number(),
    serving: z.number().default(1),
    occurrences: z.number().default(0)
});




export const daySchema = z.object({
    date: z.object({
        day: z.string(),
        month: z.string(),
        year: z.string()
    }),
    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema
});

export const plannerSchema = z.object({
    userId: z.string(),
    startDate: z.object({
        day: z.string(),
        month: z.string(),
        year: z.string()
    }),
    weeks: z.union([z.literal(1), z.literal(2), z.literal(4)]).pipe(z.coerce.number()),
    meals: z.array(daySchema)
})

export const algorithmInputSchema = z.object({
    calories: z.number(),
    dietaryRestrictions: z.array(z.string()),
    excludeIngredients: z.array(z.string()),
});

export const dateSchema = z.object({
    day: z.string(),
    month: z.string(),
    year: z.string()
});



export type UserConstraints = z.infer<typeof userConstraintsSchema>;
export type Meal = z.infer<typeof mealSchema>;
export type Day = z.infer<typeof daySchema>;
export type Planner = z.infer<typeof plannerSchema>;
export type AlgorithmInput = z.infer<typeof algorithmInputSchema>;
export type calendarDate = z.infer<typeof dateSchema>;

export type mealPlanningAlgorithm = (constraints: AlgorithmInput) => Promise<Meal>;