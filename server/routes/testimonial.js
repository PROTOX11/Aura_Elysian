import express from "express";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getTestimonials,
  createTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

router.get("/", asyncHandler(getTestimonials));
router.post("/", auth, asyncHandler(createTestimonial));

export default router;
