import { Express, Request, Response } from "express";
import { AuthRequest, verifyToken, verifyTokenOrBypass } from "../firebase/handleAuthentication";
import { admin, firestore } from "../firebase/firebasesetup";


export default function registerVotingHandler(app: Express){
    app.put("/updateUserMealVote", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Extract the necessary data
            const { mealId, mealName, liked } = req.body;
            const userId = req.user?.uid;
            
            // Ensure all of the necessary data are present
            if (!mealId || !mealName || typeof liked !== "boolean"){
                return res.status(400).json({
                    success: false,
                    message: "Invalid fields"
                });
            }

            // Make sure the user is authenticated
            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "you must sign-in to update votes"
                });
            }

            // Get the meal votes doc
            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
            
            
            if (!mealVotesDoc.exists){
                // If the doc doesn't exist and the meal is liked, then create the doc with only the liked meal liked
                // and the disliked meals empty. If the meal is disliked, then create it the other way around
                if (liked){
                    await firestore.collection("mealVotes").doc(userId).set({
                        liked: {[mealId]: mealName},
                        disliked: {},
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                } else {
                    await firestore.collection("mealVotes").doc(userId).set({
                        liked: {},
                        disliked: {[mealId]: mealName},
                        createdAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                }
                // Return 200
                return res.status(200).json({
                    success: true,
                    message: `Meal voting for user ${userId} created successfully`
                });
            }

            // Get the data and extract the all the meals with votes
            const voteData = mealVotesDoc.data();

            const likedMeals = voteData?.liked || {};
            const dislikedMeals = voteData?.disliked || {};
            // Default to the meal not previously existing
            let alreadyExisted = false;

            if (liked){
                // If the meal was already liked, then delete it from the preferences and set already existed to true
                // Otherwise add the meal to the liked ones and delete it from the disliked meals
                if (likedMeals[mealId]){
                    delete likedMeals[mealId];
                    alreadyExisted = true;
                } else {
                    likedMeals[mealId] = mealName;
                    delete dislikedMeals[mealId];
                }

            } else {
                // If the meal was already disliked, then delete it from the preferences and set already existed to true
                // Otherwise add the meal to the disliked ones and delete it from the liked meals
                if (dislikedMeals[mealId]){
                    delete dislikedMeals[mealId];
                    alreadyExisted = true;
                } else {
                    dislikedMeals[mealId] = mealName;
                    delete likedMeals[mealId];
                }

            } 

            // Update the document with the new preferneces 
            await firestore.collection("mealVotes").doc(userId).update({
                liked: likedMeals,
                disliked: dislikedMeals,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            // Return 200 with a small message to confirm the updated vote
            return res.status(200).json({
                success: true,
                message: `${liked ? "Liked" : "Disliked"} meal updated successfully`,
                alreadyExisted: alreadyExisted
            });


        } catch (error){
            console.error("Error while updating user meal votes", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user meal votes"
            });
        }
    });

    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/getUserMealVotes/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/getUserMealVotes/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";


            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing fields"
                });
            }

            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();

            // If the doc doesn't exist, return 404
            if (!mealVotesDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No preferences found for user ${userId}`
                });
            }

            // Get all the existing user votes and constructs a set-like object from these
            const voteData = mealVotesDoc.data();
            const likedArray = Object.keys(voteData?.liked || {}).map(id => parseInt(id));
            const dislikedArray = Object.keys(voteData?.disliked || {}).map(id => parseInt(id));

            // Return these to the user
            return res.status(200).json({
                success: true,
                liked: likedArray,
                disliked: dislikedArray
            });


        } catch (error){
            console.error("Error while updating user information", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });

    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/checkUserMealVotes/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/checkUserMealVotes/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing fields"
                });
            }

            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();

            // If mealVotes don't exist, return 200, but set exists to false
            if (!mealVotesDoc.exists){
                return res.status(200).json({
                    success: true,
                    exists: false
                });
            }

            // If mealVotes exist, return 200 and set exists to true
            return res.status(200).json({
                success: true,
                exists: true
            });


        } catch (error){
            console.error("Error while updating user information", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });


    app.delete("/deleteUserMealVotes", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Ensure user is authenticated and return 401 if they aren't
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must log in order to delete your meal vote preferences"
                });
            }

            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();

            // If there is not existing document, return a 404
            if (!mealVotesDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No votes to delete for user ${userId}`
                });
            }

            // Delete the doc if it exists and return a personalised 200
            await mealVotesDoc.ref.delete();

            return res.status(200).json({
                success: true,
                message: `Successfully deleted voted meals for user ${userId}`
            });


        } catch (error){
            console.error("Error while updating user information", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });


    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/checkIfMealVoted/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/checkIfMealVoted/:userId", async (req: Request, res: Response) => {
        try{
        // Check that our input is of the correct form and return 400 if it isn't
        const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
        const mealId = typeof req.query.mealId === "string" ? req.query.mealId.trim() : "";


        if (userId === "" || mealId === ""){
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
        
        // If there is no document for this user, then return 200 but with hasVotes and mealPresent equal to false
        if (!mealVotesDoc.exists){
            return res.status(200).json({
                success: true,
                hasVotes: false,
                mealPresent: false,
                message: `No preferences for user ${userId}`
            });
        }

        // Get liked and disliked meals data
        const votesData = mealVotesDoc.data();
        const liked = votesData?.liked || {};
        const disliked = votesData?.disliked || {};

        // If the meal is present in the docs, then return all true except for the liked field, which
        // depends on whether the meal is liked or disliked
        if (liked[mealId]){
            return res.status(200).json({
                success: true,
                hasVotes: true,
                mealPresent: true,
                liked: true,
            });
        } else if (disliked[mealId]){
            return res.status(200).json({
                success: true,
                hasVotes: true,
                mealPresent: true,
                liked: false
            });
        }

        // If a doc exists but has no votes for this meal, return mealPresent as false
        return res.status(200).json({
            success: true,
            hasVotes: true,
            mealPresent: false
        });


        } catch (error){
            console.error("Error while updating user information", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });
}