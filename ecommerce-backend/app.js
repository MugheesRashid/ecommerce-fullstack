const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");
const cartRoutes = require("./routes/cart.route");

const app = express();

// ==================== MIDDLEWARE ====================

// Security Middleware
app.use(helmet());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Request Logging Middleware (optional)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== DATABASE CONNECTION ====================

const connectDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    await mongoose.connect(mongoURI);

    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Error:", error.message);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDatabase();

// ==================== ROUTES ====================

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date(),
  });
});

// API Documentation Route
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    message: "E-Commerce Backend API",
    version: "1.0.0",
    endpoints: {
      auth: {
        register: "POST /api/auth/register",
        login: "POST /api/auth/login",
        adminLogin: "POST /api/auth/admin/login",
      },
      user: {
        getProfile: "GET /api/auth/user/profile",
        updateProfile: "PUT /api/auth/user/profile",
        changePassword: "PUT /api/auth/user/change-password",
      },
      wishlist: {
        getWishlist: "GET /api/auth/user/wishlist",
        addToWishlist: "POST /api/auth/user/wishlist",
        removeFromWishlist: "DELETE /api/auth/user/wishlist/:productId",
      },
      orders: {
        createOrder: "POST /api/orders",
        getUserOrders: "GET /api/orders/user",
        getOrderById: "GET /api/orders/:orderId",
        trackOrder: "GET /api/orders/track/:orderNumber",
        cancelOrder: "PUT /api/orders/:orderId/cancel",
        admin: {
          getAllOrders: "GET /api/orders/admin/all",
          getOrderById: "GET /api/orders/admin/:orderId",
          updateStatus: "PUT /api/orders/admin/:orderId/status",
          updateTracking: "PUT /api/orders/admin/:orderId/tracking",
          getStatistics: "GET /api/orders/admin/statistics",
        },
      },
      cart: {
        getCart: "GET /api/cart",
        addToCart: "POST /api/cart/add",
        updateCart: "PUT /api/cart/update/:productId",
        removeFromCart: "DELETE /api/cart/remove/:productId",
        clearCart: "DELETE /api/cart/clear",
      },
      admin: {
        dashboard: "GET /api/auth/admin/dashboard",
      },
    },
  });
});

// Auth Routes
app.use("/api/auth", authRoutes);

// Product Routes
app.use("/api/products", productRoutes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Order Routes
const orderRoutes = require("./routes/order.route");
app.use("/api/orders", orderRoutes);

// ==================== ERROR HANDLING ====================

// 404 Route Not Found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { error: err }),
  });
});

module.exports = app;
