import "dotenv/config";
import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
  : undefined;

const hasServiceAccount = !!(projectId && clientEmail && privateKey);

if (!admin.apps.length) {
  if (hasServiceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        } as any),
        projectId, // explicitly provide projectId to avoid automatic detection
      });
      console.log(
        `Firebase Admin initialized using service-account env vars for project: ${projectId}`
      );
    } catch (err) {
      console.error(
        "Failed to initialize Firebase Admin with service-account env vars:",
        err
      );
      // try ADC as fallback
      try {
        if (!projectId) {
          throw new Error(
            "No projectId available for ADC fallback. Set FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT."
          );
        }
        admin.initializeApp({ projectId });
        console.warn(
          "Firebase Admin initialized using Application Default Credentials (fallback)."
        );
      } catch (err2) {
        console.error("Failed to initialize Firebase Admin with ADC:", err2);
        throw new Error(
          "Firebase Admin initialization failed. Provide service-account env vars (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) or set GOOGLE_APPLICATION_CREDENTIALS to a valid JSON file and ensure a project id is available (FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT)."
        );
      }
    }
  } else {
    // try Application Default Credentials
    try {
      if (!projectId) {
        throw new Error(
          "No projectId found in env (FIREBASE_PROJECT_ID or GOOGLE_CLOUD_PROJECT). Set one before using ADC."
        );
      }
      admin.initializeApp({ projectId });
      console.log(
        `Firebase Admin initialized using Application Default Credentials for project: ${projectId}`
      );
    } catch (err) {
      console.error(
        "No service-account env vars found and ADC initialization failed:",
        err
      );
      throw new Error(
        "Firebase Admin initialization failed. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (with \\n newlines) or provide Application Default Credentials and ensure a project id is available (GOOGLE_CLOUD_PROJECT)."
      );
    }
  }
}

export const firestore = admin.firestore();
export { admin };
