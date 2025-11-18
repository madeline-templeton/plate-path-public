import { Express, Request, Response } from "express";
import { userConstraintsSchema } from "../../globals";
import { mealController } from "./mealGenerationController";

export async function registerMealGenerationHandler(app: Express) {
    app.post("/api/planner/generate", async (req: Request, res: Response) => {
        try {
            const parsedConstraints = userConstraintsSchema.safeParse(req.body.constraints);

            if (!parsedConstraints.success){
                return res.status(400).json({
                    success: false,
                    message: "Invalid constraints provided",
                    error: parsedConstraints.error
                });
            }

            const constraints = parsedConstraints.data;

            const controllerResponse = mealController(constraints);

            

        } catch(error){
            return res.status(500).json({
                success: false,
                message: ("Server Error while generating a meal plan"),
                error: error
            })
        }
        
    })

}