import { Express, Response, Request } from "express";
import { AuthRequest, verifyToken, verifyTokenOrBypass } from "../firebase/handleAuthentication";
import { userConstraintsSchema } from "../../globals";
import { admin, firestore } from "../firebase/firebasesetup";

export async function registerUserInformationHandler(app: Express) {
    app.put("/updateUserInformation", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Extract the userInfo and userIf from their respective locations
            const userInfo = req.body.userInfo;
            const userId = req.user?.uid;

            // Return a 401 if the user isn't authenticated
            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign in in order to update user information",
                });
            }

            // Attempt to parse the userInfo and return a 400 if this fails
            const parsedUserInfo = userConstraintsSchema.safeParse(userInfo);

            if (!parsedUserInfo.success){
                return res.status(400).json({
                    success: false,
                    error: parsedUserInfo.error,
                    message: "Invalid user information provided"
                });
            }

            // Make sure the user is trying to edit their own information
            if (userId !== parsedUserInfo.data.userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: You may not edit a user information that isn't yours",
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            // If no doc exists, add one to the collection with the correct fields and return a 200
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

            // Otherwise, update the fields with the new values and return a 200
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
            console.error("Error while updating user information", error);
            res.status(500).json({
                success: false,
                error: "Error while updating user information"
            });
        }
    });


    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/getUserInformation/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    });


    app.get("/getUserInformation/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "Missing fields"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            // If no information exists, return a 404
            if (!userInfoDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No information found for user ${userId}`
                });
            }

            // Otherwise return the user information
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


    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/checkIfInfoInStorage/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "No userId provided"
        });
    });

    
    app.get("/checkIfInfoInStorage/:userId", async (req: Request, res: Response) => {
        try{
            // Check that our input is of the correct form and return 400 if it isn't
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "";

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            // If the userInfoDoc doesn't exist, then return exists as false but return a 200
            if (!userInfoDoc.exists){
                return res.status(200).json({
                    success: true,
                    exists: false
                });
            }

            // If it does exist, then return exists as true
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

    app.delete("/deleteUserInfo", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{
            // Ensure user is authenticated and return 401 if they aren't
            const userId = req.user?.uid;

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "Must be authenticated to delete user information"
                });
            }

            const userInfoDoc = await firestore.collection("userInfo").doc(userId).get();

            // If no doc to delete exists, then return a 404
            if (!userInfoDoc.exists){
                return res.status(404).json({
                    success: false,
                    message: `No doc found to delete for user ${userId}`
                });
            }

            const userInfo = userInfoDoc.data();

            // Check that the user is attempting to delete their own user information
            if (userInfo?.userId !== userId){
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: you can only delete your own information"
                });
            }

            // Delete the data and return a 200x
            await userInfoDoc.ref.delete();

            console.log(`User Information for ${userId} deleted successfully`);

            return res.status(200).json({
                success: true,
                message: "User information deleted successfully"
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