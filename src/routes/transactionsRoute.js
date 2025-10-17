import express from "express";
const router = express.Router();
import { sql } from "../config/db.js";
import {
  getTransactionByUserId,
  getNewTransaction,
  deleteTransactionsById,
  getSummaryByUserId,
} from "../controllers/transactionsController.js";
// Get transactions by user ID
router.get("/:userId", getTransactionByUserId);

// Create new transaction
router.post("/", getNewTransaction);

// Delete transaction by ID
router.delete("/:id", deleteTransactionsById);

// Get transactions summary for a user
router.get("/summary/:userId", getSummaryByUserId);

export default router;
