import React, { useState, useEffect, useContext } from "react";
import { Star, ChevronRight, ChevronLeft, Loader, AlertCircle, Heart } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import ProductAPIService from "../services/productAPI";
import CartAPIService from "../services/cartAPI";
import WishlistAPIService from "../services/wishlistAPI";
import { UserContextData } from "../assets/context/UserContext";

function ProductDetail() {
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContextData);

  // Fetch product details on mount
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await ProductAPIService.getProductById(productId);
        
        // Handle both response structures
        const productData = response.data || response;
        
        // Ensure product has image array
        if (productData.image && !Array.isArray(productData.image)) {
          productData.image = [productData.image];
        } else if (!productData.image) {
          productData.image = ['./product/iphone.png'];
        }

        // Format image paths
        productData.image = productData.image.map(img => {
          if (img.startsWith('http')) {
            return img;
          }
          return `./product/${img}`;
        });

        setProduct(productData);
        setSelectedImageIndex(0);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F6F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F6F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
          <p className="text-red-600">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  // Calculate star rating display
  const fullStars = Math.floor(product.rating || 4);
  const hasHalfStar = (product.rating || 4) % 1 !== 0;

  // Truncate description
  const truncatedDescription = product.description && product.description.length > 150 
    ? product.description.substring(0, 150) + "..."
    : product.description || "No description available";

  // Handle image navigation
  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === product.image.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? product.image.length - 1 : prev - 1
    );
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      await CartAPIService.addToCart(product._id || product.id, quantity);
      alert(`Added ${quantity} item(s) to cart`);
      setQuantity(1);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    try {
      if (isInWishlist) {
        await WishlistAPIService.removeFromWishlist(product._id || product.id);
        setIsInWishlist(false);
      } else {
        await WishlistAPIService.addToWishlist(product._id || product.id);
        setIsInWishlist(true);
      }
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F9FB]">
      {/* Back Button */}
      <div className="container bg-[#F2F5F7] mx-auto px-4 py-4">
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Products
        </button>
      </div>

      {/* Main Product Container */}
      <div className="container bg-[#F2F5F7] mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Image Gallery Section - Left Column on Desktop */}
          <div className="lg:w-1/2">
            {/* Main Image Container */}
            <div className="bg-gray-100 rounded-xl p-4 md:p-8 mb-4 md:mb-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                <img
                  src={product.image[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
                
                {/* Image Navigation Arrows (only show if multiple images) */}
                {product.image.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors lg:hidden"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors lg:hidden"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery (Desktop only) */}
            {product.image.length > 1 && (
              <div className="hidden lg:grid grid-cols-4 gap-3">
                {product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`bg-gray-100 rounded-lg p-2 hover:bg-gray-200 transition-colors ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Section - Right Column on Desktop */}
          <div className="lg:w-1/2">
            {/* Category Label */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-full">
                {product.category || 'Uncategorized'}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => {
                  if (i < fullStars) {
                    return (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    );
                  } else if (hasHalfStar && i === fullStars) {
                    return (
                      <div key={i} className="relative">
                        <Star className="w-5 h-5 text-gray-300 fill-current" />
                        <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <Star
                        key={i}
                        className="w-5 h-5 text-gray-300 fill-current"
                      />
                    );
                  }
                })}
              </div>
              <span className="text-gray-700 font-medium">{product.rating || 4}</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl font-bold text-red-600">
                  ${product.price ? product.price.toFixed(2) : '0.00'}
                </span>
                {product.discountedPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Indicator */}
            <div className="mb-8">
              <div className={`inline-flex items-center px-4 py-2 rounded-lg ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="font-medium">
                  {product.stock > 0 
                    ? `In Stock (${product.stock} available)` 
                    : 'Out of Stock'
                  }
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  disabled={product.stock === 0}
                  min="1"
                  max={product.stock}
                  className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-center disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <div className="text-gray-700 leading-relaxed">
                <p className={expandedDescription ? '' : 'line-clamp-3'}>
                  {expandedDescription ? product.description : truncatedDescription}
                </p>
                {product.description && product.description.length > 150 && (
                  <button
                    onClick={() => setExpandedDescription(!expandedDescription)}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    {expandedDescription ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-10 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="flex-1 lg:flex-initial px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isAddingToCart ? 'Adding...' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 py-4 rounded-lg border-2 transition-colors duration-300 ${
                  isInWishlist 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <Heart className="w-6 h-6" fill={isInWishlist ? "currentColor" : "none"} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Image Navigation Dots */}
      {product.image.length > 1 && (
        <div className="lg:hidden flex justify-center gap-2 mt-4 pb-8">
          {product.image.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                selectedImageIndex === index 
                  ? 'bg-blue-600' 
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Decorative Bottom Spacing */}
      <div className="h-8 lg:h-16"></div>
    </div>
  );
}

export default ProductDetail;