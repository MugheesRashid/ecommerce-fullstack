const jwt = require("jsonwebtoken");
const AuthService = require("../services/auth.service");

// Authenticate User Middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    const decoded = await AuthService.verifyToken(token);

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token, authorization denied",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Token verification failed",
    });
  }
};

// Authenticate Admin Middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Admin Auth Token:", token);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided, authorization denied",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server error: JWT_SECRET not configured",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!decoded || !decoded.role) {
      return res.status(403).json({
        success: false,
        message: "Invalid token structure",
      });
    }

    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token: missing user ID",
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error("❌ Admin auth error:", error.message);
    res.status(401).json({
      success: false,
      message: error.message || "Token verification failed",
    });
  }
};

module.exports = { authenticateUser, authenticateAdmin };
