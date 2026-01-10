const express = require("express");
const router = express.Router();
const AuthService = require("../services/auth.service");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth.middleware");

// ==================== PUBLIC ROUTES ====================

// User Registration
router.post("/register", async (req, res) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.log("Login error:", error);
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.loginAdmin(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== USER PROTECTED ROUTES ====================

// Get User Profile
router.get("/user/profile", authenticateUser, async (req, res) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update User Profile
router.put("/user/profile", authenticateUser, async (req, res) => {
  try {
    const result = await AuthService.updateUserProfile(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Change Password
router.put("/user/change-password", authenticateUser, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new password",
      });
    }

    const result = await AuthService.changePassword(
      req.user.id,
      oldPassword,
      newPassword
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== WISHLIST ROUTES ====================

// Get Wishlist
router.get("/user/wishlist", authenticateUser, async (req, res) => {
  try {
    const result = await AuthService.getWishlist(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add to Wishlist
router.post("/user/wishlist", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const result = await AuthService.addToWishlist(req.user.id, productId);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Remove from Wishlist
router.delete("/user/wishlist/:productId", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await AuthService.removeFromWishlist(req.user.id, productId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ORDER ROUTES ====================

// Get User Orders
router.get("/user/orders", authenticateUser, async (req, res) => {
  try {
    const result = await AuthService.getUserOrders(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add Order
router.post("/user/orders", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity, paymentMethod, totalPrice } = req.body;

    if (!productId || !quantity || !paymentMethod || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details",
      });
    }

    const result = await AuthService.addOrder(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ADDRESS MANAGEMENT ROUTES ====================

// Get user addresses
router.get("/user/addresses", authenticateUser, async (req, res) => {
  try {
    const result = await AuthService.getAddresses(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add address
router.post("/user/addresses", authenticateUser, async (req, res) => {
  try {
    const result = await AuthService.addAddress(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update address
router.put("/user/addresses/:addressId", authenticateUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const result = await AuthService.updateAddress(req.user.id, addressId, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete address
router.delete("/user/addresses/:addressId", authenticateUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const result = await AuthService.deleteAddress(req.user.id, addressId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Set default address
router.put("/user/addresses/:addressId/default", authenticateUser, async (req, res) => {
  try {
    const { addressId } = req.params;
    const result = await AuthService.setDefaultAddress(req.user.id, addressId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ADMIN PROTECTED ROUTES ====================

// Admin Dashboard (protected)
router.get("/admin/dashboard", authenticateAdmin, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Admin dashboard accessed successfully",
      admin: req.admin,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
