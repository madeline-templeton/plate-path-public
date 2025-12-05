import { Express, Request, Response } from "express";
import { AuthRequest, verifyToken } from "../firebase/handleAuthentication";
import { success } from "zod";
import { admin, firestore } from "../firebase/firebasesetup";

export async function registerConsentHandler(app: Express){
    app.put("/updateUserConsent", verifyToken, async (req: AuthRequest, res: Response) => {
        try{    
            console.log(req.body)
            const userId = req.user?.uid;
            const { consent, providedUserId } = req.body;

            if (!consent || !providedUserId){
                return res.status(400).json({
                    success: false,
                    message: "Incorrect input provided"
                });
            }

            if (!userId){
                return res.status(401).json({
                    success: false,
                    message: "You must sign-in to edit consent settings"
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
                    consent: consent,
                    createdAt: admin.firestore.FieldValue.serverTimestamp()
                });

                return res.status(200).json({
                    success: true,
                    message: "Consent created successfully"
                });
            }

            await firestore.collection("userConsent").doc(userId).update({
                consent: consent,
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

    app.get("/getUserConsent/:userId", async (req: Request, res: Response) => {
        try{
            const userId = typeof req.params.userId === "string" ? req.params.userId.trim() : "" ;

            if (userId === ""){
                return res.status(400).json({
                    success: false,
                    message: "No userId provided",
                    exists: false
                });
            }

            const consentDoc = await firestore.collection("userConsent").doc(userId).get();

            if (!consentDoc.exists){
                return res.status(200).json({
                    success: true,
                    message: "No consent exists for this user",
                    exists: false
                })
            }

            const consentData = consentDoc.data();

            return res.status(200).json({
                success: true,
                exists: true,
                consent: consentData
            })

        } catch (error) {

        }
    });

}