import { Express, Response, Request } from "express";
import { plannerSchema } from "../../globals";
import { admin, firestore } from "../firebase/firebasesetup";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";



export async function registerPlannerHandler(app:Express) {
    app.put("/updatePlanner", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const planner = req.body.planner;
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to update the planner",
                });
            }

            const parsedPlanner = plannerSchema.safeParse(planner);

            if (!parsedPlanner.success){
                return res.status(400).json({
                    success: false,
                    message: "Input does not conform to specifications",
                    error: parsedPlanner.error
                });
            }

            console.log(userId)
            console.log(parsedPlanner.data.userId)

            if (userId !== parsedPlanner.data.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You may not edit a planner that isn't yours",
                });
            }


            const plannerDoc = await firestore.collection("planners").doc(parsedPlanner.data.userId).get();

            if (!plannerDoc.exists){
                await firestore.collection("planners").doc(userId).set({
                    userId: userId,
                    startDate: parsedPlanner.data.startDate,
                    weeks: parsedPlanner.data.weeks,
                    meals: parsedPlanner.data.meals,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return res.status(200).json({
                    success: true,
                    message: "New planner created successfully",
                    plannerId: userId
                });
            }


            await firestore.collection("planners").doc(userId).update({
                startDate: parsedPlanner.data.startDate,
                weeks: parsedPlanner.data.weeks,
                meals: parsedPlanner.data.meals,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            })

            return res.status(200).json({
                success: true,
                message: `Planner for user ${parsedPlanner.data.userId} has been updated`
            });



        } catch(error){
            console.error("Error while updating planner", error)
            res.status(500).json({
                success: false,
                error: "Error while updating planner"
            });
        }
    });


    app.get("/getPlannerForUser/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing userId",
                })
            }

            const plannerDoc = await firestore.collection("planners").doc(userId).get();


            if (!plannerDoc.exists){
                return res.status(400).json({
                    success: false,
                    error: `No planner for user ${userId}`
                });
            }

            return res.status(200).json({
                success: true,
                planner: plannerDoc.data()
            });


        } catch(error){
            console.error("Error while updating planner", error)
            res.status(500).json({
                success: false,
                error: "Error while updating planner"
            });
        }
    });

    app.delete("/deletePlannerForUser", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to delete a planner",
                });
            }

            const planner = await firestore.collection("planners").doc(userId).get();

            if (!planner.exists){
                return res.status(404).json({
                    success: false,
                    message: "No doc found to delete",
                });
            }

            const plannerData = planner.data();

            if (userId !== plannerData?.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: User does not have permission to delete this trade",
                });
            }

            await planner.ref.delete();

            console.log("Planner deleted successfully");

            return res.status(200).json({
                success: true,
                message: "Planner deleted successfully"
            });

        } catch (error){
            console.error("Error while updating planner", error);
            res.status(500).json({
                success: false,
                error: "Error while updating planner"
            });
        }

    });


    app.get("/checkUserPlannerExists/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing userId",
                })
            }

            const plannerDoc = await firestore.collection("planners").doc(userId).get();


            if (!plannerDoc.exists){
                return res.status(200).json({
                    success: true,
                    exists: false
                });
            }

            return res.status(200).json({
                success: true,
                exists: true
            });


        } catch(error){
            console.error("Error while updating planner", error)
            res.status(500).json({
                success: false,
                error: "Error while updating planner"
            });
        }
    });
}