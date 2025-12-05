import { Express, Response, Request } from "express";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { userConstraintsSchema } from "../../globals";
import { success } from "zod";
import { admin, firestore } from "../firebase/firebasesetup";
import { userInfo } from "os";

export async function registerUserInformationHandler(app: Express) {
    app.put("/updateUserInformation", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const userInfo = req.body.userInfo;
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to update user information",
                });
            }

            const parsedUserInfo = userConstraintsSchema.safeParse(userInfo);

            if (!parsedUserInfo.success){
                return res.status(400).json({
                    success: false,
                    error: parsedUserInfo.error,
                    message: "Invalid user information provided"
                });
            }

            if (userId !== parsedUserInfo.data.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You may not edit a planner that isn't yours",
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            if (!userInfoDoc.exists){
                await firestore.collection("userInfo").doc(userId).set({
                    userId: userId,
                    age: parsedUserInfo.data.age,
                    sex: parsedUserInfo.data.sex,
                    height: parsedUserInfo.data.height,
                    weight: parsedUserInfo.data.weight,
                    weightGoal: parsedUserInfo.data.weightGoal,
                    activityLevel: parsedUserInfo.data.activityLevel,
                    dietaryRestrictions: parsedUserInfo.data.dietaryRestrictions,
                    weeks: parsedUserInfo.data.weeks,
                    startDate: parsedUserInfo.data.date,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return res.status(200).json({
                    success: true,
                    message: "User Information doc created successfully"
                });
            }

            await firestore.collection("userInfo").doc(userId).update({
                age: parsedUserInfo.data.age,
                sex: parsedUserInfo.data.sex,
                height: parsedUserInfo.data.height,
                weight: parsedUserInfo.data.weight,
                weightGoal: parsedUserInfo.data.weightGoal,
                activityLevel: parsedUserInfo.data.activityLevel,
                dietaryRestrictions: parsedUserInfo.data.dietaryRestrictions,
                weeks: parsedUserInfo.data.weeks,
                startDate: parsedUserInfo.data.date,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            return res.status(200).json({
                success: true,
                message: "User Information doc updated successfully"
            });


        } catch (error){
            console.error("Error while updating user information", error)
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });


    app.get("/getUserInformation/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            if (!userInfoDoc.exists){
                return res.status(200).json({
                    success: false,
                    message: `No information found for user ${userId}`
                });
            }

            return res.status(200).json({
                success: true,
                userInfo: userInfoDoc.data()
            });

        } catch (error){
            console.error("Error while getting user information", error)
            res.status(500).json({
                success: false,
                message: "Error while getting user information"
            });
        }
    });


    app.get("/checkIfInfoInStorage/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            if (!userInfoDoc.exists){
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
            console.error("Error while getting user information", error)
            res.status(500).json({
                success: false,
                message: "Error while getting user information"
            });
        }
    });

    app.delete("/deleteUserInfo", verifyToken, async (req: AuthRequest, res: Response) => {
        try{
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "Must be authenticated to delete user information"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            if (!userInfoDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No doc found to delete for user ${userId}`
                });
            }

            const userInfo = userInfoDoc.data();

            if (userInfo?.userId !== userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: you can only delete your own information"
                });
            }

            await userInfoDoc.ref.delete();

            console.log(`User Information for ${userId} deleted successfully`);

            return res.status(200).json({
                success: true,
                message: "User Information deleted successfully"
            });

        } catch (error){
            console.error("Error while deleting user information", error)
            res.status(500).json({
                success: false,
                message: "Error while deleting user information"
            });
        }
    });


}