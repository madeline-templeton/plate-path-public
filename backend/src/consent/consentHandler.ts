import { Express, Request, Response } from "express";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { success } from "zod";
import { admin, firestore } from "../firebase/firebasesetup";
import { verifyTokenOrBypass } from "../firebase/handleAuthentication";

export async function registerConsentHandler(app: Express){
    // Use verifyTokenOrBypass instead of verifyToken to check for testing
    app.put("/updateUserConsent", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{    
            // Extract the user Id and necessary fields from the user and body respectively
            const userId = req.user?.uid;
            const { sensitiveConsent, generalConsent, providedUserId} = req.body;

            // Check we have all of our fields
            if (!sensitiveConsent || !generalConsent || !providedUserId){
                return res.status(400).json({
                    success: false,
                    message: "Incorrect input provided"
                });
            }

            // Make sure the user is authenticated
            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorised: No token provided"
                });
            }


            // Check that the user whose settings we want to update is the same user as the one making the request
            if (providedUserId !== userId){
                return res.status(403).json({
                    success: false,
                    message: "You may not edit another user's settings"
                });
            }

            // Get the doc
            const consentDoc = await firestore.collection("userConsent").doc(userId).get();
            
            // If the doc doesn't exist, create it and return a 200 status
            if (!consentDoc.exists){
                await firestore.collection("userConsent").doc(userId).set({
                    sensitiveConsent: sensitiveConsent,
                    generalConsent: generalConsent,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return res.status(200).json({
                    success: true,
                    message: `Sensitive consent ${sensitiveConsent} successfully; General Consent ${generalConsent} successfully`
                });
            }

            // Otherwise update the document with the current time and return a 200 status
            await firestore.collection("userConsent").doc(userId).update({
                sensitiveConsent: sensitiveConsent,
                generalConsent: generalConsent,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });


            return res.status(200).json({
                success: true,
                message: "Consent updated successfully"
            });
        } catch (error){
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while updating consent"
            });
        }
    });

    // Needed to create this mini endpoint as if we call the next endpoint without the userId it is 
    // treated as a separate endpoint
    app.get("/getUserConsent/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "No userId provided",
            exists: false
        });
    });


    app.get("/getUserConsent/:userId", async (req: Request, res: Response) => {
        try{
            // Make sure our param is of the correct form
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "" ;

            // Return a 400 status if it isn't provided
            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided",
                    exists: false
                });
            }

            // Attempt to get the required doc
            const consentDoc = await firestore.collection("userConsent").doc(userId).get();

            // Attempt to get the required doc's data
            const consentData = consentDoc.data();

            // If the doc or the data don't exist, return a 200 but the exists field is false
            if (!consentDoc.exists || !consentData){
                return res.status(200).json({
                    success: true,
                    message: "No consent data exists for this user",
                    exists: false
                });
            }

            // If the data does exist, return it with exists as true
            return res.status(200).json({
                success: true,
                exists: true,
                sensitiveConsent: consentData.sensitiveConsent,
                generalConsent: consentData.generalConsent
            })

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while getting consent"
            });
        }
    });


    // Endpoint for deleting consent
    // Only used in testing
    app.delete("/deleteUserConsent", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.uid;

            // Check user is authenticated
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorised: No token provided"
                });
            }

            // make sure the doc exists
            const consentDoc = await firestore.collection("userConsent").doc(userId).get();

            if (!consentDoc.exists) {
                return res.status(404).json({
                    success: false,
                    message: "No consent data found for this user"
                });
            }

            // Delete doc
            await firestore.collection("userConsent").doc(userId).delete();

            return res.status(200).json({
                success: true,
                message: "Consent data deleted successfully"
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                message: "Error while deleting consent"
            });
        }
    });

}