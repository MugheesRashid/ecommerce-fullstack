const express = require("express");
const router = express.Router();
const CartService = require("../services/cart.service");
const { authenticateUser } = require("../middleware/auth.middleware");

// ==================== CART ROUTES (ALL PROTECTED) ====================

// Get user's cart
router.get("/", authenticateUser, async (req, res) => {
  try {
    const result = await CartService.getCart(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Add item to cart
router.post("/add", authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product ID and quantity are required",
      });
    }

    const result = await CartService.addToCart(req.user.id, productId, quantity);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update cart item quantity
router.put("/update/:productId", authenticateUser, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Quantity is required",
      });
    }

    const result = await CartService.updateCartItem(
      req.user.id,
      productId,
      quantity
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Remove item from cart
router.delete("/remove/:productId", authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await CartService.removeFromCart(req.user.id, productId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Clear cart
router.delete("/clear", authenticateUser, async (req, res) => {
  try {
    const result = await CartService.clearCart(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
