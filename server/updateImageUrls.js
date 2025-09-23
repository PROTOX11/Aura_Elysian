import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/Aura_Elysian",
    );
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

// Update image URLs from local paths to Cloudinary URLs
const updateImageUrls = async () => {
  try {
    await connectDB();

    // Find users with local image paths
    const usersWithLocalImages = await User.find({
      image: { $regex: /^\/uploads\// },
    });

    console.log(
      `Found ${usersWithLocalImages.length} users with local image paths`,
    );

    for (const user of usersWithLocalImages) {
      console.log(`User ${user.name} has local image: ${user.image}`);
      // You can either:
      // 1. Set to null/empty to force re-upload
      // 2. Or update to a default Cloudinary image
      user.image = null; // This will force the user to re-upload their image
      await user.save();
      console.log(`Updated user ${user.name} - image set to null`);
    }

    console.log("✅ Image URL update completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating image URLs:", error);
    process.exit(1);
  }
};

updateImageUrls();
