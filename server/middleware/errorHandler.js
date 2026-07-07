import mongoose from "mongoose";

export const globalErrorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({ message: "Validation error", details: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  return res.status(err.statusCode || 500).json({ message: err.message || "Internal server error" });
};
