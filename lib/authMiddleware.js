import jwt from "jsonwebtoken";
import User from "../models/User";

export const authMiddleware = async (req, res, next) => {
  try {
    // Check if the authorization header is present
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication failed: Invalid credentials or access denied.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Malformed authorization header. Token not found.",
      });
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please provide a valid token.",
      });
    }

    // Find the user by the decoded token's id and check if the token matches
    const user = await User.findOne({ where: { id: decoded.id, token } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token or user not found.",
      });
    }

    // Attach user to the request object
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};
