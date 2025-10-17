import express from "express";
import dotenv from "dotenv";
import { sql } from "./src/config/db.js";
import ratelimiter from "./src/middleware/rateLimiter.js";
import transactionsRoute from "./src/routes/transactionsRoute.js";
import job from "./src/config/cron.js";

// Load environment variables from .env
dotenv.config();

const app = express();
if (process.env.NODE_ENV === "production") {
  job.start();
}

// Middleware
app.use(express.json());       // Parse JSON request bodies
app.use(ratelimiter);          // Apply global rate limiting

// Initialize DB table (if not already created)
async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
      )
    `;
    console.log("✅ DATABASE SUCCESSFULLY INITIALIZED");
  } catch (error) {
    console.error("❌ ERROR INITIALIZING DATABASE:", error);
  }
}

// Routes
app.use("/api/transactions", transactionsRoute);
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "API is healthy" });
});

// Start server
const PORT = process.env.PORT || 5001;

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
});
