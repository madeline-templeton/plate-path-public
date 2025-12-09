import { Express, Request, Response } from "express";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { success } from "zod";
import { admin, firestore } from "../firebase/firebasesetup";
import { verifyTokenOrBypass } from "../firebase/handleAuthentication";

export async function registerConsentHandler(app: Express){
    // Use verifyTokenOrBypass instead of verifyToken for tests
    app.put("/updateUserConsent", verifyTokenOrBypass, async (req: AuthRequest, res: Response) => {
        try{    
            console.log(req.body)
            const userId = req.user?.uid;
            const { sensitiveConsent, generalConsent, providedUserId} = req.body;

            if (!sensitiveConsent || !generalConsent || !providedUserId){
                return res.status(400).json({
                    success: false,
                    message: "Incorrect input provided"
                });
            }

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "Unauthorised: No token provided"
                });
            }

            if (providedUserId !== userId){
                return res.status(403).json({
                    success: false,
                    message: "You may not edit another user's settings"
                });
            }


            const consentDoc = await firestore.collection("userConsent").doc(userId).get();

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

    app.get("/getUserConsent/", async (req: Request, res: Response) => {
        return res.status(400).json({
            success: false,
            message: "No userId provided",
            exists: false
        });
    });


    app.get("/getUserConsent/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "" ;
            console.log(userId)

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided",
                    exists: false
                });
            }

            const consentDoc = await firestore.collection("userConsent").doc(userId).get();

            const consentData = consentDoc.data();

            if (!consentDoc.exists || !consentData){
                return res.status(200).json({
                    success: true,
                    message: "No consent data exists for this user",
                    exists: false
                })
            }


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

}