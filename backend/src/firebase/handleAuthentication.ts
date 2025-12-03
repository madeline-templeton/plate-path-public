import { NextFunction, Request, Response } from "express";
import { admin } from "./firebasesetup";

export interface AuthRequest extends Request{
    user?: {
        uid: string;
        email: string | undefined;
    }
}

export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Unauthorised: No token provided"});
    }

    const token = authHeader.split("Bearer ")[1];

    try{
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next();
    } catch(error){
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorised: Invalid token' });
    }
}
