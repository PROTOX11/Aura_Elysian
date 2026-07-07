import express from "express";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { verifyToken } from "../controllers/authController.js";

const router = express.Router();

router.get("/verify", auth, asyncHandler(verifyToken));

export default router;
