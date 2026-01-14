import React, { useState, useEffect } from "react";
import {
  Heart,
  LayoutGrid,
  Star,
  TextAlignJustify,
  Filter,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import ProductAPIService from "../services/productAPI";
import WishlistAPIService from "../services/wishlistAPI";

function ProductListing() {
  const [isGridView, setIsGridView] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [filters, setFilters] = useState({
    category: [],
    priceRange: { min: 0, max: 1000 },
    inStock: false,
  });
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlSearch = searchParams.get("search");

  useEffect(() => {
    setFilters({
      category: urlCategory ? [urlCategory] : [],
      priceRange: { min: 0, max: 1000 },
      inStock: false,
    });
  }, []);

  // Fetch user's wishlist on mount
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        if(!localStorage.getItem("token")) return;
        const response = await WishlistAPIService.getWishlist();
        if (response.success || Array.isArray(response.wishlist)) {
          const wishlistIds = (
            response.wishlist ||
            response.data?.wishlist ||
            []
          ).map(
            (item) =>
              item.productId?._id || item.productId || item._id || item.id
          );
          setWishlist(wishlistIds);
        }
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let response;
        response = await ProductAPIService.getAllProducts(1, 100);
        if (urlCategory) {
          setFilters((prev) => ({
            ...prev,
            category: urlCategory ? [urlCategory] : prev.category,
          }));
        } else if (urlSearch) {
          response = await ProductAPIService.searchProducts(urlSearch);
        }

        // Handle both response structures
        let productList = [];
        if (Array.isArray(response)) {
          productList = response;
        } else if (response?.data && Array.isArray(response.data)) {
          productList = response.data;
        } else if (response?.products && Array.isArray(response.products)) {
          productList = response.products;
        }
        setProducts(productList);
      } catch (err) {
        console.error("Error fetching products:", err.message);
        setError(err.message || "Failed to load products");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [urlCategory, urlSearch]);

  const categories = [
    "All",
    "electronics",
    "clothing",
    "furniture",
    "accessories",
    "other",
  ];

  const productsPerPage = 9;

  // Toggle wishlist
  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        await WishlistAPIService.removeFromWishlist(productId);
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        // Add to wishlist
        await WishlistAPIService.addToWishlist(productId);
        setWishlist((prev) => [...prev, productId]);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert(
        "Failed to update wishlist: " + (error.message || "Please try again")
      );
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => wishlist.includes(productId);

  // Filter products based on selected filters - use actual products
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (
      filters.category.length > 0 &&
      !filters.category.includes("All") &&
      !filters.category.includes(product.category)
    ) {
      return false;
    }

    // Price range filter
    if (
      product.price < filters.priceRange.min ||
      product.price > filters.priceRange.max
    ) {
      return false;
    }

    // In stock filter
    if (filters.inStock && product.stock === 0) {
      return false;
    }

    return true;
  });

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "featured":
      default:
        return 0; // Keep original order for featured
    }
  });
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Calculate paginated products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handle filter changes
  const handleCategoryChange = async (category) => {
    if (category === "All") {
      setFilters((prev) => ({ ...prev, category: ["All"] }));
    } else {
      setFilters((prev) => {
        const newCategories = prev.category.includes(category)
          ? prev.category.filter((c) => c !== category)
          : [...prev.category.filter((c) => c !== "All"), category];
        return { ...prev, category: newCategories };
      });
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      priceRange: { ...prev.priceRange, [name]: parseInt(value) },
    }));
  };

  const handleStockChange = (e) => {
    setFilters((prev) => ({ ...prev, inStock: e.target.checked }));
  };

  const resetFilters = () => {
    setFilters({
      category: [],
      priceRange: { min: 0, max: 1000 },
      inStock: false,
    });
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when filters or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row">
      {/* Mobile Filter Button */}
      <div className="md:hidden w-full px-4 py-3">
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="w-full flex items-center justify-between bg-white border border-solid border-[#DEE2E7] rounded-lg px-4 py-3"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} />
            <span className="font-medium">Filters</span>
          </div>
          {showMobileFilters ? (
            <ChevronUp size={20} />
          ) : (
            <ChevronDown size={20} />
          )}
        </button>
      </div>

      {/* Filters Section - Mobile Dropdown */}
      {showMobileFilters && (
        <div className="md:hidden w-full px-4 mb-4">
          <div className="bg-white border border-solid border-[#DEE2E7] rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={resetFilters}
                className="text-blue-600 text-sm font-medium"
              >
                Reset all
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`mobile-category-${category}`}
                      checked={
                        filters.category.includes(category) ||
                        (category === "All" && filters.category.length === 0)
                      }
                      onChange={() => {
                        handleCategoryChange(category);
                        console.log(
                          "Mobile category filter changed:",
                          category
                        );
                      }}
                      className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`mobile-category-${category}`}
                      className="text-sm"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Price Range</h4>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">${filters.priceRange.min}</span>
                <span className="text-sm">${filters.priceRange.max}</span>
              </div>
              <div className="space-y-4">
                <input
                  type="range"
                  name="min"
                  min="0"
                  max="1000"
                  value={filters.priceRange.min}
                  onChange={handlePriceChange}
                  className="w-full"
                />
                <input
                  type="range"
                  name="max"
                  min="0"
                  max="1000"
                  value={filters.priceRange.max}
                  onChange={handlePriceChange}
                  className="w-full"
                />
              </div>
            </div>

            {/* In Stock Filter */}
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="mobile-inStock"
                  checked={filters.inStock}
                  onChange={handleStockChange}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="mobile-inStock" className="text-sm font-medium">
                  In Stock Only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters Section - Desktop */}
      <div className="hidden md:block left w-full md:w-1/4 h-full bg-white p-4 border-r border-solid border-[#DEE2E7]">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <button
            onClick={resetFilters}
            className="text-blue-600 text-sm font-medium mb-4"
          >
            Reset all
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Category</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={
                    filters.category.includes(category) ||
                    (category === "All" && filters.category.length === 0)
                  }
                  onChange={() => {
                    handleCategoryChange(category);
                    console.log("Mobile category filter changed:", category);
                  }}
                  className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-medium mb-3">Price Range</h4>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">${filters.priceRange.min}</span>
            <span className="text-sm">${filters.priceRange.max}</span>
          </div>
          <div className="space-y-4">
            <input
              type="range"
              name="min"
              min="0"
              max="1000"
              value={filters.priceRange.min}
              onChange={handlePriceChange}
              className="w-full"
            />
            <input
              type="range"
              name="max"
              min="0"
              max="1000"
              value={filters.priceRange.max}
              onChange={handlePriceChange}
              className="w-full"
            />
          </div>
        </div>

        {/* In Stock Filter */}
        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="inStock"
              checked={filters.inStock}
              onChange={handleStockChange}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="inStock" className="text-sm font-medium">
              In Stock Only
            </label>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="right w-full md:w-3/4 px-4 md:px-5 h-full">
        <div className="bar mt-3 border border-solid border-[#DEE2E7] rounded-lg bg-white py-4 flex flex-col md:flex-row items-center justify-between px-4 md:px-5 h-auto md:h-12.5 w-full">
          <p className="mb-3 md:mb-0 text-sm md:text-base">
            {sortedProducts.length} items in{" "}
            <strong>
              {filters.category.length > 0 || filters.category[0] === "All"
                ? filters.category.map((cat) => cat).join(", ")
                : "All Categories"}
            </strong>
            {wishlist.length > 0 && (
              <span className="ml-3 text-pink-600 text-sm">
                ({wishlist.length} in wishlist)
              </span>
            )}
          </p>
          <div className="input_&_grids flex flex-row items-center w-full md:w-auto justify-between">
            <select
              className="px-3 py-2 md:py-1 border border-solid border-[#DEE2E7] rounded-md outline-none text-sm md:text-base"
              name="sort"
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="flex flex-row justify-center items-center ml-4">
              <LayoutGrid
                onClick={() => setIsGridView(true)}
                className={`cursor-pointer p-1 border border-solid ${
                  isGridView ? "bg-[#EFF2F4]" : ""
                } border-[#DEE2E7] rounded-tl-sm rounded-bl-sm`}
                width={29}
                height={29}
              />
              <TextAlignJustify
                onClick={() => setIsGridView(false)}
                className={`cursor-pointer p-1 ${
                  isGridView ? "" : "bg-[#EFF2F4]"
                } border border-solid border-[#DEE2E7] rounded-tr-sm rounded-br-sm`}
                width={29}
                height={29}
              />
            </div>
          </div>
        </div>

        {/* Products Grid/List View */}
        <div
          className={`items mt-5 ${
            isGridView
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "flex flex-col gap-4"
          }`}
        >
          {urlSearch && (
            <div className="col-span-full text-center py-2">
              <p className="text-lg text-[#606060]">
                Search results for "<strong>{urlSearch}</strong>"
              </p>{" "}
              <button
                className="bg-blue-500 font-medium cursor-pointer px-3 py-2 text-white rounded-lg"
                onClick={() => navigate("/products")}
              >
                Reset Search
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="col-span-full flex items-center justify-center py-12 text-red-600">
              {error}
            </div>
          ) : currentProducts.length === 0 && sortedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-[#606060]">No products found.</p>
            </div>
          ) : (
            currentProducts.map((product) => {
              const inWishlist = isInWishlist(product._id || product.id);
              const productImage = product.image
                ? product.image.startsWith("http")
                  ? product.image
                  : `./product/${product.image}`
                : "./product/iphone.png";

              return (
                <div
                  key={product._id || product.id}
                  className={`bg-white border border-solid border-[#DEE2E7] rounded-lg ${
                    isGridView
                      ? "flex flex-col py-3 justify-between"
                      : "flex flex-col md:flex-row py-3 md:items-center"
                  }`}
                >
                  {/* Product Image - Clickable */}
                  <div
                    onClick={() =>
                      navigate(`/product/${product._id || product.id}`)
                    }
                    className={`${
                      isGridView ? "px-4" : "md:w-1/4 px-4 md:px-6"
                    } cursor-pointer`}
                  >
                    <img
                      src={productImage}
                      alt={product.name}
                      className={`w-full ${
                        isGridView ? "h-48 md:h-56" : "h-48 md:h-32"
                      } object-contain px-4 py-2 border-b md:border-b-0 md:border-r border-solid border-[#DEE2E7]`}
                    />
                  </div>

                  {/* Product Details */}
                  <div
                    className={`${
                      isGridView ? "px-4 mt-3" : "md:w-3/4 px-4 md:px-6"
                    }`}
                  >
                    <div
                      className={`${
                        isGridView
                          ? "flex flex-row justify-between"
                          : "flex flex-col md:flex-row md:items-center justify-between"
                      }`}
                    >
                      <div
                        className={`${
                          isGridView ? "left" : "md:w-2/3"
                        } cursor-pointer flex-1`}
                        onClick={() =>
                          navigate(`/product/${product._id || product.id}`)
                        }
                      >
                        <p className="price font-semibold text-lg">
                          ${product.price ? product.price.toFixed(2) : "0.00"}{" "}
                          <span className="actualp text-sm text-[#606060] line-through">
                            $
                            {product.discountedPrice
                              ? product.discountedPrice.toFixed(2)
                              : product.price
                              ? product.price.toFixed(2)
                              : "0.00"}
                          </span>
                        </p>
                        <div className="rating mt-1 flex flex-row items-center gap-1">
                          <span className="flex flex-row items-center justify-center gap-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                width={18}
                                height={18}
                                fill={
                                  i < Math.floor(product.rating || 4)
                                    ? "#FFC107"
                                    : "#E4E5E9"
                                }
                                color={
                                  i < Math.floor(product.rating || 4)
                                    ? "#FFC107"
                                    : "#E4E5E9"
                                }
                              />
                            ))}
                          </span>
                          <span className="text-yellow-500 text-sm ml-1">
                            {product.rating || 4}
                          </span>
                        </div>
                      </div>
                      <div
                        className={`right ${isGridView ? "" : "mt-2 md:mt-0"}`}
                      >
                        <div
                          onClick={() =>
                            toggleWishlist(product._id || product.id)
                          }
                          className={`
                            p-2 rounded-full cursor-pointer transition-all duration-300 
                            ${
                              inWishlist
                                ? "bg-pink-100 border border-pink-200 hover:bg-pink-200"
                                : "hover:bg-gray-100"
                            }
                          `}
                        >
                          <Heart
                            width={24}
                            height={24}
                            color={inWishlist ? "#EC4899" : "#8B96A5"}
                            fill={inWishlist ? "#EC4899" : "none"}
                            className="transition-all duration-300"
                          />
                        </div>
                      </div>
                    </div>

                    <p
                      className="text-[#1C1C1C] font-medium text-base mt-2 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        navigate(`/product/${product._id || product.id}`)
                      }
                    >
                      {product.name}
                    </p>
                    <p className="text-[#606060] text-sm mt-1 leading-tight">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock > 0
                            ? `In Stock (${product.stock})`
                            : "Out of Stock"}
                        </span>
                        <span className="text-sm text-[#8B96A5] bg-gray-100 px-2 py-1 rounded">
                          {product.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {sortedProducts.length > 0 && (
          <div className="mt-8 mb-6 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-[#606060] mb-4 sm:mb-0">
              Showing {indexOfFirstProduct + 1} to{" "}
              {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
              {sortedProducts.length} results
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 border border-solid border-[#DEE2E7] rounded-md text-sm ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border border-solid border-[#DEE2E7] rounded-md text-sm ${
                      currentPage === page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 border border-solid border-[#DEE2E7] rounded-md text-sm ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {sortedProducts.length === 0 && (
          <div className="mt-10 text-center">
            <p className="text-lg text-[#606060]">
              No products found matching your filters.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-6 py-2 cursor-pointer bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListing;
