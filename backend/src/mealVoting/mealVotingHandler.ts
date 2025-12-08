import { Express, Request, Response } from "express";
import { AuthRequest, verifyToken, verifyTokenOrBypass } from "../firebase/handleAuthentication";
import { success } from "zod";
import { admin, firestore } from "../firebase/firebasesetup";
import { use } from "react";
import { create } from "domain";

export default function registerVotingHandler(app: Express){
    app.put("/updateUserMealVote", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            const { mealId, mealName, liked } = req.body;
            const userId = req.user?.uid;
            

            if (!mealId || !mealName || typeof liked !== "boolean"){
                return res.status(400).json({
                    success: false,
                    message: "Invalid fields"
                });
            }

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "you must sign-in to update votes"
                });
            }

            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
            
            if (!mealVotesDoc.exists){
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

                return res.status(200).json({
                    success: true,
                    message: `Meal voting for user ${userId} created successfully`
                });
            }

            const voteData = mealVotesDoc.data();

            const likedMeals = voteData?.liked || {};
            const dislikedMeals = voteData?.disliked || {};
            let alreadyExisted = false;

            if (liked){
                if (likedMeals[mealId]){
                    delete likedMeals[mealId];
                    alreadyExisted = true;
                } else {
                    likedMeals[mealId] = mealName;
                    delete dislikedMeals[mealId];
                }

            } else {
                if (dislikedMeals[mealId]){
                    delete dislikedMeals[mealId];
                    alreadyExisted = true;
                } else {
                    dislikedMeals[mealId] = mealName;
                    delete likedMeals[mealId];
                }

            } 

            await firestore.collection("mealVotes").doc(userId).update({
                liked: likedMeals,
                disliked: dislikedMeals,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

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

    app.get("/getUserMealVotes/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/getUserMealVotes/:userId", async (req: Request, res: Response) => {
        try{
        const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";


        if (userId === ""){
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
        
        if (!mealVotesDoc.exists){
            return res.status(404).json({
                success: false,
                message: `No preferences found for user ${userId}`
            });
        }

        const voteData = mealVotesDoc.data();
        const likedArray = Object.keys(voteData?.liked || {}).map(id => parseInt(id));
        const dislikedArray = Object.keys(voteData?.disliked || {}).map(id => parseInt(id));


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

    app.get("/checkUserMealVotes/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/checkUserMealVotes/:userId", async (req: Request, res: Response) => {
        try{
        const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";


        if (userId === ""){
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
        
        if (!mealVotesDoc.exists){
            return res.status(200).json({
                success: true,
                exists: false
            });
        }

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
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must log in order to delete your meal vote preferences"
                });
            }

            const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();

            if (!mealVotesDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No votes to delete for user ${userId}`
                });
            }

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

    app.get("/checkIfMealVoted/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });

    app.get("/checkIfMealVoted/:userId", async (req: Request, res: Response) => {
        try{
        const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";
        const mealId = typeof req.query.mealId === "string" ? req.query.mealId.trim() : "";
        console.log(mealId)


        if (userId === "" || mealId === ""){
            return res.status(400).json({
                success: false,
                message: "Missing fields"
            });
        }

        const mealVotesDoc = await firestore.collection("mealVotes").doc(userId).get();
        
        if (!mealVotesDoc.exists){
            return res.status(200).json({
                success: true,
                hasVotes: false,
                mealPresent: false,
                message: `No preferences for user ${userId}`
            });
        }

        const votesData = mealVotesDoc.data();

        const liked = votesData?.liked || {};
        const disliked = votesData?.disliked || {};

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