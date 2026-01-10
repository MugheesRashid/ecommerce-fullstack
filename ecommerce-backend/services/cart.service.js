const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

class CartService {
  // Get user's cart
  static async getCart(userId) {
    try {
      let cart = await Cart.findOne({ userId }).populate(
        "items.productId",
        "name price image description"
      );

      if (!cart) {
        cart = await Cart.create({
          userId,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      }

      return {
        success: true,
        cart,
      };
    } catch (error) {
      throw new Error(`Failed to get cart: ${error.message}`);
    }
  }

  // Add item to cart
  static async addToCart(userId, productId, quantity) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      if (product.stock < quantity) {
        throw new Error("Insufficient stock");
      }

      let cart = await Cart.findOne({ userId });

      if (!cart) {
        cart = new Cart({
          userId,
          items: [
            {
              productId,
              quantity,
              price: product.price,
            },
          ],
        });
      } else {
        const existingItem = cart.items.find(
          (item) => item.productId.toString() === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            productId,
            quantity,
            price: product.price,
          });
        }
      }

      // Recalculate totals
      this.recalculateCart(cart);
      await cart.save();

      const populatedCart = await cart.populate(
        "items.productId",
        "name price image description"
      );

      return {
        success: true,
        message: "Item added to cart",
        cart: populatedCart,
      };
    } catch (error) {
      throw new Error(`Failed to add to cart: ${error.message}`);
    }
  }

  // Update cart item quantity
  static async updateCartItem(userId, productId, quantity) {
    try {
      if (quantity < 0) {
        throw new Error("Quantity cannot be negative");
      }

      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw new Error("Cart not found");
      }

      const cartItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (!cartItem) {
        throw new Error("Item not in cart");
      }

      if (quantity === 0) {
        cart.items = cart.items.filter(
          (item) => item.productId.toString() !== productId
        );
      } else {
        const product = await Product.findById(productId);
        if (product.stock < quantity) {
          throw new Error("Insufficient stock");
        }
        cartItem.quantity = quantity;
      }

      this.recalculateCart(cart);
      await cart.save();

      const populatedCart = await cart.populate(
        "items.productId",
        "name price image description"
      );

      return {
        success: true,
        message: "Cart updated",
        cart: populatedCart,
      };
    } catch (error) {
      throw new Error(`Failed to update cart: ${error.message}`);
    }
  }

  // Remove item from cart
  static async removeFromCart(userId, productId) {
    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.items = cart.items.filter(
        (item) => item.productId.toString() !== productId
      );

      this.recalculateCart(cart);
      await cart.save();

      const populatedCart = await cart.populate(
        "items.productId",
        "name price image description"
      );

      return {
        success: true,
        message: "Item removed from cart",
        cart: populatedCart,
      };
    } catch (error) {
      throw new Error(`Failed to remove from cart: ${error.message}`);
    }
  }

  // Clear cart
  static async clearCart(userId) {
    try {
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        throw new Error("Cart not found");
      }

      cart.items = [];
      cart.totalItems = 0;
      cart.totalPrice = 0;

      await cart.save();

      return {
        success: true,
        message: "Cart cleared",
        cart,
      };
    } catch (error) {
      throw new Error(`Failed to clear cart: ${error.message}`);
    }
  }

  // Helper function to recalculate totals
  static recalculateCart(cart) {
    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;
  }
}

module.exports = CartService;
