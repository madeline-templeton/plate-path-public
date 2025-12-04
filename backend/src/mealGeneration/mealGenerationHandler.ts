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
                    error: parsedConstraints.error.message
                });
            }

            const constraints = parsedConstraints.data;

            const controllerResponse = await mealController(constraints);

            if (controllerResponse.success && controllerResponse.planner && !controllerResponse.error){
                return res.status(200).json({
                    success: true,
                    planner: controllerResponse.planner
                })
            } else {
                return res.status(500).json({
                    success: false,
                    message: controllerResponse.error?.message || "Error while generating a meal plan",
                    error: controllerResponse.error
                })
            }

        } catch(error){
            return res.status(500).json({
                success: false,
                message: ("Server Error while generating a meal plan"),
                error: error
            })
        }
        
    })

}