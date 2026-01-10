const express = require("express");
const router = express.Router();
const ProductService = require("../services/product.service");
const { authenticateAdmin } = require("../middleware/auth.middleware");

// ============================================
// ADMIN ONLY - CRUD OPERATIONS
// ============================================

// Create a new product (Admin only)
router.post("/admin/create", authenticateAdmin, async (req, res) => {
  try {
    const { name, price, image, description, category, stock, discountedPrice } = req.body;

    // Validation
    if (!name || !price || !image || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const productData = {
      name,
      price,
      discountedPrice,
      image,
      description,
      category,
      stock: stock || 0,
    };

    const product = await ProductService.createProduct(productData);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update product (Admin only)
router.put("/admin/update/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Prevent updating timestamps
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const product = await ProductService.updateProduct(id, updateData);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete product (Admin only)
router.delete("/admin/delete/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await ProductService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ============================================
// PUBLIC - READ OPERATIONS
// ============================================

// Get all products (Public)
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = await ProductService.getAllProducts(page, limit);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get product by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
});

// Get products by category (Public)
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = await ProductService.getProductsByCategory(
      category,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Search products (Public)
router.get("/search/:searchTerm", async (req, res) => {
  try {
    const { searchTerm } = req.params;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const result = await ProductService.searchProducts(searchTerm, page, limit);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
