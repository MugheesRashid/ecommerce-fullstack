const express = require("express");
const router = express.Router();
const OrderService = require("../services/order.service");
const { authenticateUser, authenticateAdmin } = require("../middleware/auth.middleware");

// ==================== USER ROUTES ====================

// Create order (from checkout)
router.post("/", authenticateUser, async (req, res) => {
  try {
    const orderData = req.body;
    const result = await OrderService.createOrder(req.user.id, orderData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get user orders
router.get("/user", authenticateUser, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await OrderService.getUserOrders(req.user.id, page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order by ID (User)
router.get("/:orderId", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrderById(orderId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order by order number (User)
router.get("/track/:orderNumber", authenticateUser, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const result = await OrderService.getOrderByOrderNumber(orderNumber, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

// Cancel order (User)
router.put("/:orderId/cancel", authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.cancelOrder(orderId, req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all orders (Admin)
router.get("/admin/all", authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filters = {
      status: req.query.status,
      paymentMethod: req.query.paymentMethod,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const result = await OrderService.getAllOrders(page, limit, filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order by ID (Admin)
router.get("/admin/:orderId", authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await OrderService.getOrderById(orderId);
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

// Update order status (Admin)
router.put("/admin/:orderId/status", authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const result = await OrderService.updateOrderStatus(orderId, status, notes);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Update tracking number (Admin)
router.put("/admin/:orderId/tracking", authenticateAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { trackingNumber } = req.body;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required",
      });
    }

    const result = await OrderService.updateTrackingNumber(orderId, trackingNumber);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order statistics (Admin)
router.get("/admin/statistics", authenticateAdmin, async (req, res) => {
  try {
    const result = await OrderService.getOrderStatistics();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
