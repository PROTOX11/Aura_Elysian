import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log(
    "Extracted token:",
    token ? token.substring(0, 20) + "..." : "No token",
  );

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authentication token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "test");
    console.log("Token decoded successfully:", {
      id: decoded.id,
      email: decoded.email,
    });
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
