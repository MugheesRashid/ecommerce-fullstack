import React, { useState, useEffect, useContext } from "react";
import { Trash2, Heart, ShoppingCart, Tag, ChevronRight, Plus, Minus, X, Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartAPIService from "../services/cartAPI";
import WishlistAPIService from "../services/wishlistAPI";
import { UserContextData } from "../assets/context/UserContext";

function ShoppingCartPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContextData);
  
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const taxRate = 0.1; // 10% tax

  // Fetch cart from API
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await CartAPIService.getCart();
        setCartItems(response.cart?.items || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);

  // Calculate subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal - discount + tax;

  // Quantity handlers
  const increaseQuantity = async (productId) => {
    const item = cartItems.find(i => i.productId._id === productId);
    if (item) {
      try {
        await CartAPIService.updateCartItem(productId, item.quantity + 1);
        setCartItems(cartItems.map(i =>
          i.productId._id === productId ? { ...i, quantity: i.quantity + 1 } : i
        ));
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  };

  const decreaseQuantity = async (productId) => {
    const item = cartItems.find(i => i.productId._id === productId);
    if (item && item.quantity > 1) {
      try {
        await CartAPIService.updateCartItem(productId, item.quantity - 1);
        setCartItems(cartItems.map(i =>
          i.productId._id === productId && i.quantity > 1 
            ? { ...i, quantity: i.quantity - 1 } 
            : i
        ));
      } catch (err) {
        console.error("Error updating quantity:", err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await CartAPIService.removeFromCart(productId);
      setCartItems(cartItems.filter(item => item.productId._id !== productId));
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const moveToWishlist = async (item) => {
    try {
      await WishlistAPIService.addToWishlist(item.productId._id);
      removeFromCart(item.productId._id);
    } catch (err) {
      console.error("Error moving to wishlist:", err);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1); // 10% discount
    } else if (couponCode.toLowerCase() === "save20") {
      setDiscount(subtotal * 0.2); // 20% discount
    } else {
      setDiscount(0);
      alert("Invalid coupon code. Try 'SAVE10' or 'SAVE20'");
    }
  };

  const clearCoupon = () => {
    setCouponCode("");
    setDiscount(0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">Please login to view your cart.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-3 sm:px-4 lg:px-6">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-xs text-gray-600 mt-1">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Cart Items */}
          <div className="lg:w-2/3">
            {/* Cart Items List */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              {cartItems.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Your cart is empty</p>
                  <button
                    onClick={() => navigate("/products")}
                    className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => {
                    const productId = item.productId._id || item.productId;
                    const productImage = item.productId.image?.startsWith('http') 
                      ? item.productId.image 
                      : './product/' + item.productId.image;
                    
                    return (
                      <div key={productId} className="p-3 sm:p-4">
                        <div className="flex items-start gap-3">
                          {/* Product Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                            <img
                              src={productImage}
                              alt={item.productId.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div className="flex-1 pr-2">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                                  {item.productId.name}
                                </h3>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                                {item.quantity > 1 && (
                                  <p className="text-xs text-gray-500">
                                    ${item.price.toFixed(2)} each
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Quantity Controls & Actions */}
                            <div className="flex items-center justify-between mt-3">
                              {/* Quantity Controls */}
                              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                  onClick={() => decreaseQuantity(productId)}
                                  className="px-2 py-1.5 hover:bg-gray-100 active:bg-gray-200"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-3 py-1.5 text-xs font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => increaseQuantity(productId)}
                                  className="px-2 py-1.5 hover:bg-gray-100 active:bg-gray-200"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => moveToWishlist(item)}
                                  className="text-xs text-gray-600 hover:text-blue-600 flex items-center gap-1 px-2 py-1.5 rounded hover:bg-blue-50"
                                >
                                  <Heart className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Save</span>
                                </button>
                                <button
                                  onClick={() => removeFromCart(productId)}
                                  className="text-xs text-gray-600 hover:text-red-600 flex items-center gap-1 px-2 py-1.5 rounded hover:bg-red-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span className="hidden sm:inline">Remove</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Coupon Section */}
            {cartItems.length > 0 && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-medium text-gray-900">Coupon Code</h3>
                  </div>
                  {discount > 0 && (
                    <button
                      onClick={clearCoupon}
                      className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Remove coupon
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={applyCoupon}
                    className="px-4 py-1.5 text-xs font-medium bg-gray-800 text-white rounded hover:bg-gray-900 active:bg-gray-700"
                  >
                    Apply
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Try coupon codes: <span className="font-mono">SAVE10</span> or <span className="font-mono">SAVE20</span>
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-1/3">
              <div className="sticky top-4">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Order Summary</h3>
                  
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Discount</span>
                        <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={() => navigate("/checkout")}
                    className="w-full mt-6 px-4 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
                  >
                    Proceed to Checkout
                    <ChevronRight className="inline-block w-4 h-4 ml-1 -mt-0.5" />
                  </button>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      Free shipping on orders over $100
                    </p>
                  </div>
                </div>

                {/* Continue Shopping Link */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/products")}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    Continue Shopping
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Fixed Bottom Bar (for non-empty state) */}
        {cartItems.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs text-gray-600">Total ({cartItems.length} items)</p>
                <p className="text-sm font-bold text-gray-900">${total.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => navigate("/checkout")}
                className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800"
              >
                Checkout
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              Free shipping on orders over $100
            </p>
          </div>
        )}

        {/* Bottom spacing for mobile fixed bar */}
        <div className="h-20 lg:h-0"></div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;
