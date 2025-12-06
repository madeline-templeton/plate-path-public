import express, { Express } from "express";
import cors from "cors";
import { registerMealGenerationHandler } from "./mealGeneration/mealGenerationHandler";
import { registerPlannerHandler } from "./planners/plannerHandler";
import { registerUserInformationHandler } from "./userInformation/userInformationHandler";
import { registerConsentHandler } from "./consent/consentHandler";
import registerVotingHandler from "./mealVoting/mealVotingHandler";


/**
 * Class representing the backend server application.
 */
export class ServerApp {
  public app: Express;
  private port: number;


  /**
   * Creates a new ServerApp instance.
   *
   * @param port - The port number the server listens on (default: 3001).
   * @param options - Configuration options for the server
   */
  constructor(port: number = 8080) {
    this.app = express();
    this.port = port;

    this.configureMiddleware();
    this.registerHandlers();
  }

  /**
   * Configures global middleware for the Express app.
   */
  private configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: "5mb" }));
  }

  /**
   * Registers all route handlers for the server.
   */
  private registerHandlers() {
    registerMealGenerationHandler(this.app);
    registerPlannerHandler(this.app);
    registerUserInformationHandler(this.app);
    registerConsentHandler(this.app);
    registerVotingHandler(this.app);
  }

  /**
   * Starts the Express server on the configured port.
   */
  public start() {
    this.app.listen(this.port, () => {
      console.log(`Backend running at http://localhost:${this.port}`);
    });
  }


  /**
   * Returns the underlying Express app instance.
   *
   * @returns The Express application.
   */
  public getApp(): Express {
    return this.app;
  }
}

/**
 * Starts the server if this module is run directly.
 */
const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const server = new ServerApp();
  server.start();
} else {
  console.log("failed");
}