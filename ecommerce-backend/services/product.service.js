const Product = require("../model/product.model");

class ProductService {
  // Create a new product
  static async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  // Get all products
  static async getAllProducts(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments();

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getProductById(productId) {
    try {
      const product = await Product.findById(productId)

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to fetch product: ${error.message}`);
    }
  }

  // Get products by category
  static async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({
        category: category.toLowerCase(),
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({
        category: category.toLowerCase(),
      });

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }
  }

  // Update product
  static async updateProduct(productId, updateData) {
    try {
      const product = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }

  // Delete product
  static async deleteProduct(productId) {
    try {
      const product = await Product.findByIdAndDelete(productId);

      if (!product) {
        throw new Error("Product not found");
      }

      return { success: true, message: "Product deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  // Search products
  static async searchProducts(searchTerm, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const products = await Product.find({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Product.countDocuments({
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
        ],
      });

      return {
        products,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }
}

module.exports = ProductService;
