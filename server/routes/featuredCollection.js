import express from "express";
import { auth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  getFeaturedCollections,
  createFeaturedCollection,
} from "../controllers/featuredCollectionController.js";

const router = express.Router();

router.get("/", asyncHandler(getFeaturedCollections));
router.post("/", auth, asyncHandler(createFeaturedCollection));

export default router;
