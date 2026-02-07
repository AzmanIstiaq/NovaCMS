// Thin entrypoint for Vercel serverless functions.
// It imports the Express app from backend/server.js and lets Vercel handle the listener.
import app from "../backend/server.js";

export default app;
