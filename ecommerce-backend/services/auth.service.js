const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

class AuthService {
  // Generate JWT Token
  static generateToken(userId) {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  }

  // User Registration
  static async registerUser(userData) {
    try {
      console.log("Registering user with data:", userData);
      const { fullname, email, password, phone, address } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      // Create new user
      const newUser = new User({
        fullname,
        email,
        password,
        phone,
        address,
        role: "user",
      });

      await newUser.save();

      // Generate token
      const token = this.generateToken(newUser._id);

      return {
        success: true,
        message: "User registered successfully",
        user: newUser.getPublicData(),
        token,
      };
    } catch (error) {
      throw new Error(error.message || "Registration failed");
    }
  }

  // User Login
  static async loginUser(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Please provide email and password");
      }

      // Find user and include password field
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        throw new Error("Invalid email or password");
      }

      // Check password
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        throw new Error("Invalid email or password");
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = this.generateToken(user._id);

      return {
        success: true,
        message: "User logged in successfully",
        user: user.getPublicData(),
        token,
      };
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  }

  // Admin Login
  static async loginAdmin(email, password) {
    try {
      if (!email || !password) {
        throw new Error("Please provide email and password");
      }

      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      // Check credentials against .env
      if (email !== adminEmail || password !== adminPassword) {
        throw new Error("Invalid admin credentials");
      }

      // Generate admin token
      const token = jwt.sign({ id: "admin", email: adminEmail, role: "admin" }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
      });

      return {
        success: true,
        message: "Admin logged in successfully",
        admin: {
          email: adminEmail,
          role: "admin",
        },
        token,
      };
    } catch (error) {
      throw new Error(error.message || "Admin login failed");
    }
  }

  // Verify Token
  static async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }

  // Get User by ID
  static async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user.getPublicData();
    } catch (error) {
      throw new Error(error.message || "Failed to fetch user");
    }
  }

  // Update User Profile
  static async updateUserProfile(userId, updateData) {
    try {
      const { fullname, phone, address, profileImage } = updateData;

      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Update allowed fields
      if (fullname) user.fullname = fullname;
      if (phone) user.phone = phone;
      if (address) user.address = { ...user.address, ...address };
      if (profileImage) user.profileImage = profileImage;

      await user.save();

      return {
        success: true,
        message: "Profile updated successfully",
        user: user.getPublicData(),
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update profile");
    }
  }

  // Add to Wishlist
  static async addToWishlist(userId, productId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const productExists = user.wishlist.some(
        (item) => item.productId.toString() === productId
      );

      if (productExists) {
        throw new Error("Product already in wishlist");
      }

      user.wishlist.push({ productId });
      await user.save();

      return {
        success: true,
        message: "Product added to wishlist",
        wishlist: user.wishlist,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to add to wishlist");
    }
  }

  // Remove from Wishlist
  static async removeFromWishlist(userId, productId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      user.wishlist = user.wishlist.filter(
        (item) => item.productId.toString() !== productId
      );
      await user.save();

      return {
        success: true,
        message: "Product removed from wishlist",
        wishlist: user.wishlist,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to remove from wishlist");
    }
  }

  // Get Wishlist
  static async getWishlist(userId) {
    try {
      const user = await User.findById(userId).populate("wishlist.productId");
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        wishlist: user.wishlist,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch wishlist");
    }
  }

  // Add Order
  static async addOrder(userId, orderData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const { productId, quantity, paymentMethod, totalPrice } = orderData;

      const newOrder = {
        productId,
        quantity,
        paymentMethod,
        totalPrice,
      };

      user.orders.push(newOrder);
      await user.save();

      return {
        success: true,
        message: "Order added successfully",
        order: user.orders[user.orders.length - 1],
      };
    } catch (error) {
      throw new Error(error.message || "Failed to add order");
    }
  }

  // Get User Orders
  static async getUserOrders(userId) {
    try {
      const user = await User.findById(userId).populate("orders.productId");
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        orders: user.orders,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch orders");
    }
  }

  // Address Management
  static async addAddress(userId, addressData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // If this is the first address or marked as default, set it as default
      if (!user.addresses || user.addresses.length === 0 || addressData.isDefault) {
        // Remove default from other addresses
        if (user.addresses) {
          user.addresses.forEach(addr => addr.isDefault = false);
        }
        addressData.isDefault = true;
      }

      if (!user.addresses) {
        user.addresses = [];
      }

      user.addresses.push(addressData);
      await user.save();

      return {
        success: true,
        message: "Address added successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to add address");
    }
  }

  static async updateAddress(userId, addressId, addressData) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        throw new Error("Address not found");
      }

      // If setting as default, remove default from others
      if (addressData.isDefault) {
        user.addresses.forEach(addr => {
          if (addr._id.toString() !== addressId) {
            addr.isDefault = false;
          }
        });
      }

      Object.assign(address, addressData);
      await user.save();

      return {
        success: true,
        message: "Address updated successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to update address");
    }
  }

  static async deleteAddress(userId, addressId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        throw new Error("Address not found");
      }

      const wasDefault = address.isDefault;
      user.addresses.pull(addressId);

      // If deleted address was default, set first remaining address as default
      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();

      return {
        success: true,
        message: "Address deleted successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to delete address");
    }
  }

  static async setDefaultAddress(userId, addressId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      const address = user.addresses.id(addressId);
      if (!address) {
        throw new Error("Address not found");
      }

      // Remove default from all addresses
      user.addresses.forEach(addr => addr.isDefault = false);
      // Set selected address as default
      address.isDefault = true;

      await user.save();

      return {
        success: true,
        message: "Default address updated successfully",
        addresses: user.addresses,
      };
    } catch (error) {
      throw new Error(error.message || "Failed to set default address");
    }
  }

  static async getAddresses(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      return {
        success: true,
        addresses: user.addresses || [],
      };
    } catch (error) {
      throw new Error(error.message || "Failed to fetch addresses");
    }
  }

  // Change Password
  static async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
      }

      user.password = newPassword;
      await user.save();

      return {
        success: true,
        message: "Password changed successfully",
      };
    } catch (error) {
      throw new Error(error.message || "Failed to change password");
    }
  }
}

module.exports = AuthService;
