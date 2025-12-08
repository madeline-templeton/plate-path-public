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
        return res.status(401).json({ 
            success: false,
            message: "Unauthorised: No token provided"
        });
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


export async function verifyTokenOrBypass(req: AuthRequest, res: Response, next: NextFunction) {
    // Bypass authentication in test mode
    if (process.env.NODE_ENV === 'test' && req.headers['x-test-user-id']) {

        req.user = {
            uid: req.headers['x-test-user-id'] as string,
            email: 'test@example.com'
        };
        return next();
    }

    // Otherwise use normal verification
    return verifyToken(req, res, next);
}
