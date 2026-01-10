const Order = require("../model/order.model");
const User = require("../model/user.model");
const Product = require("../model/product.model");
const Cart = require("../model/cart.model");

class OrderService {
  // Create a new order
  static async createOrder(userId, orderData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const {
        items,
        shippingAddress,
        contactInfo,
        subtotal,
        shippingFee,
        tax,
        totalPrice,
        paymentMethod,
      } = orderData;

      // Validate items and get product details
      const orderItems = [];
      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        orderItems.push({
          productId: product._id,
          quantity: item.quantity,
          price: item.price,
          name: product.name,
          image: product.image,
        });

        // Update product stock
        product.stock -= item.quantity;
        await product.save();
      }

      // Create order
      const order = new Order({
        userId,
        items: orderItems,
        shippingAddress,
        contactInfo,
        subtotal,
        shippingFee,
        tax,
        totalPrice,
        paymentMethod,
        status: "pending",
      });

      await order.save();

      // Clear user's cart
      await Cart.findOneAndUpdate(
        { userId },
        { items: [], totalItems: 0, totalPrice: 0 }
      );

      return {
        success: true,
        message: "Order created successfully",
        order: await order.populate("items.productId", "name price image description"),
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Get user orders
  static async getUserOrders(userId, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const orders = await Order.find({ userId })
        .populate("items.productId", "name price image description category")
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Order.countDocuments({ userId });

      return {
        success: true,
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  // Get order by ID
  static async getOrderById(orderId, userId = null) {
    try {
      const query = { _id: orderId };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query).populate(
        "items.productId",
        "name price image description category"
      );

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        order,
      };
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  // Get order by order number
  static async getOrderByOrderNumber(orderNumber, userId = null) {
    try {
      const query = { orderNumber };
      if (userId) {
        query.userId = userId;
      }

      const order = await Order.findOne(query).populate(
        "items.productId",
        "name price image description category"
      );

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        order,
      };
    } catch (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }
  }

  // Get all orders (Admin)
  static async getAllOrders(page = 1, limit = 10, filters = {}) {
    try {
      const skip = (page - 1) * limit;
      const query = {};

      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.paymentMethod) {
        query.paymentMethod = filters.paymentMethod;
      }
      if (filters.startDate || filters.endDate) {
        query.orderDate = {};
        if (filters.startDate) {
          query.orderDate.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          query.orderDate.$lte = new Date(filters.endDate);
        }
      }

      const orders = await Order.find(query)
        .populate("userId", "fullname email")
        .populate("items.productId", "name price image")
        .sort({ orderDate: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Order.countDocuments(query);

      return {
        success: true,
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch orders: ${error.message}`);
    }
  }

  // Update order status (Admin)
  static async updateOrderStatus(orderId, status, adminNotes = "") {
    try {
      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status");
      }

      order.status = status;
      order.notes = adminNotes || order.notes;

      // Update date fields based on status
      const now = new Date();
      switch (status) {
        case "confirmed":
          order.confirmedDate = now;
          break;
        case "shipped":
          order.shippedDate = now;
          // Generate tracking number if not exists
          if (!order.trackingNumber) {
            order.trackingNumber = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          }
          break;
        case "delivered":
          order.deliveredDate = now;
          break;
        case "cancelled":
          order.cancelledDate = now;
          // Restore product stock
          for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
              product.stock += item.quantity;
              await product.save();
            }
          }
          break;
      }

      await order.save();

      return {
        success: true,
        message: "Order status updated successfully",
        order: await order.populate("items.productId", "name price image"),
      };
    } catch (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
  }

  // Update tracking number (Admin)
  static async updateTrackingNumber(orderId, trackingNumber) {
    try {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { trackingNumber },
        { new: true }
      ).populate("items.productId", "name price image");

      if (!order) {
        throw new Error("Order not found");
      }

      return {
        success: true,
        message: "Tracking number updated successfully",
        order,
      };
    } catch (error) {
      throw new Error(`Failed to update tracking number: ${error.message}`);
    }
  }

  // Cancel order (User)
  static async cancelOrder(orderId, userId) {
    try {
      const order = await Order.findOne({ _id: orderId, userId });
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.status === "delivered" || order.status === "cancelled") {
        throw new Error(`Cannot cancel order with status: ${order.status}`);
      }

      order.status = "cancelled";
      order.cancelledDate = new Date();

      // Restore product stock
      for (const item of order.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }

      await order.save();

      return {
        success: true,
        message: "Order cancelled successfully",
        order: await order.populate("items.productId", "name price image"),
      };
    } catch (error) {
      throw new Error(`Failed to cancel order: ${error.message}`);
    }
  }

  // Get order statistics (Admin)
  static async getOrderStatistics() {
    try {
      const totalOrders = await Order.countDocuments();
      const pendingOrders = await Order.countDocuments({ status: "pending" });
      const confirmedOrders = await Order.countDocuments({ status: "confirmed" });
      const shippedOrders = await Order.countDocuments({ status: "shipped" });
      const deliveredOrders = await Order.countDocuments({ status: "delivered" });
      const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

      const totalRevenue = await Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } },
      ]);

      const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

      return {
        success: true,
        statistics: {
          totalOrders,
          pendingOrders,
          confirmedOrders,
          shippedOrders,
          deliveredOrders,
          cancelledOrders,
          totalRevenue: revenue,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch statistics: ${error.message}`);
    }
  }
}

module.exports = OrderService;
