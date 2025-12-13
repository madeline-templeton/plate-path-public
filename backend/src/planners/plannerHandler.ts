import { Express, Response, Request } from "express";
import { plannerSchema } from "../../globals";
import { admin, firestore } from "../firebase/firebasesetup";
import { AuthRequest, verifyToken, verifyTokenOrBypass } from "../firebase/handleAuthentication";



export async function registerPlannerHandler(app:Express) {
    app.put("/updatePlanner", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Extract our data from the body and user field
            const planner = req.body.planner;
            const userId = req.user?.uid;

            // If the user is not authenticated, return 401
            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to update the planner",
                });
            }

            // Parse the planner using the plannerSchema
            const parsedPlanner = plannerSchema.safeParse(planner);

            // Return 400 if parse fails
            if (!parsedPlanner.success){
                return res.status(400).json({
                    success: false,
                    message: "Input does not conform to specifications",
                    error: parsedPlanner.error
                });
            }

            // Make sure the user is trying to update their own planner
            if (userId !== parsedPlanner.data.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You may not edit a planner that isn't yours",
                });
            }
        
            // Attempt to get the existing doc
            const plannerDoc = await firestore.collection("planners").doc(parsedPlanner.data.userId).get();

            // If it doesn't exist, create the panner and send back a 200
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

            // If the planner already exists, update the necessary fields and send back a 200 
            // with a personalised message
            await firestore.collection("planners").doc(userId).update({
                startDate: parsedPlanner.data.startDate,
                weeks: parsedPlanner.data.weeks,
                meals: parsedPlanner.data.meals,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

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

    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/getPlannerForUser/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing userId"
        });
    });

    app.get("/getPlannerForUser/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing userId",
                })
            }

            const plannerDoc = await firestore.collection("planners").doc(userId).get();

            // If the there is no planner in storage, return a 404
            if (!plannerDoc.exists){
                console.log(`No planner for user ${userId}`)
                return res.status(404).json({
                    success: false,
                    error: `No planner for user ${userId}`
                });
            }

            // Otherwise return the planner data
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

    app.delete("/deletePlannerForUser", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Ensure user is authenticated and return 401 if they aren't
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to delete a planner",
                });
            }

            const planner = await firestore.collection("planners").doc(userId).get();

            // Return 404 if there is not planner to delete
            if (!planner.exists){
                return res.status(404).json({
                    success: false,
                    message: "No doc found to delete",
                });
            }

            // Get the planner data
            const plannerData = planner.data();

            // Make sure the user is trying to delete their own planner
            if (userId !== plannerData?.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: User does not have permission to delete this planner",
                });
            }

            // Delete the planner and return a 200
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


    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/checkUserPlannerExists/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing userId"
        });
    });

    app.get("/checkUserPlannerExists/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing fields",
                })
            }

            const plannerDoc = await firestore.collection("planners").doc(userId).get();

            // If the planner doesn't exist, return a 200 but with exists as false
            if (!plannerDoc.exists){
                return res.status(200).json({
                    success: true,
                    exists: false
                });
            }

            // Otherwise make exists true
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