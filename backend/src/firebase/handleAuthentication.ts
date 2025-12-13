import { NextFunction, Request, Response } from "express";
import { admin } from "./firebasesetup";

/**
 * Interface to extend request for authentication
 */
export interface AuthRequest extends Request{
    user?: {
        uid: string;
        email: string | undefined;
    }
}


/**
 * Extracts the authHeader from the request. Checks that a token has been provided, before trying to decode 
 * this code by asking th auth system to check it. Lastly either provides the decoded token or an error saying
 * it is in valid
 * @param req AuthRequest
 * @param res Response
 * @param next 
 * @returns A 401 status in the case where the token is not valid
 *
 */
export async function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    // Extract the authorisation
    const authHeader = req.headers.authorization;

    // Ensure a token has been provided
    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ 
            success: false,
            message: "Unauthorised: No token provided"
        });
    }

    // Split the string to keep only the token
    const token = authHeader.split("Bearer ")[1];

    try{
        // Attempt to decode the token
        const decodedToken = await admin.auth().verifyIdToken(token);
        // Set the necessary fields in the request with the uid and email
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email
        };
        next();
    } catch(error){
        // Thrown an error if the token is of the wrong form
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorised: Invalid token' });
    }
}

/**
 * This function checks whether we are are in production or test mode. if we are in production mode then the 
 * usual verifyToken function is called. If not, then we bypass the authentication for testing. 
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns The usual verification if we are not in testing mode
 */
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
