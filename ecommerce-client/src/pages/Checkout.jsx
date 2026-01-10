import React, { useState, useEffect, useContext } from "react";
import {
  ShoppingBag,
  Truck,
  CreditCard,
  X,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronRight,
  Shield,
  CheckCircle,
  Package,
  AlertCircle,
  Loader
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CartAPIService from "../services/cartAPI";
import OrderAPIService from "../services/orderAPI";
import AuthAPIService from "../services/authAPI";
import { UserContextData } from "../assets/context/UserContext";

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useContext(UserContextData);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States"
  });

  // Fetch cart items from API
  useEffect(() => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    const fetchCart = async () => {
      try {
        setIsLoading(true);
        const response = await CartAPIService.getCart();
        const items = response.cart?.items || [];
        setCartItems(items);
        
        // Fetch user addresses
        try {
          const addressesResponse = await AuthAPIService.getAddresses();
          const userAddresses = addressesResponse.addresses || [];
          setAddresses(userAddresses);
          
          // Set default address as selected
          const defaultAddr = userAddresses.find(addr => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr._id);
          } else if (userAddresses.length > 0) {
            setSelectedAddress(userAddresses[0]._id);
          }
        } catch (err) {
          console.error("Error fetching addresses:", err);
        }
        
        // Pre-fill form with user data
        if (user) {
          setFormData(prev => ({
            ...prev,
            name: user.fullname || "",
            email: user.email || "",
            phone: user.phone || "",
          }));
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        alert("Failed to load cart. Please try again.");
        navigate("/cart");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user, navigate]);


  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingFee + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Validate form data
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all contact information fields");
      return;
    }

    const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
    if (!selectedAddr && (!formData.address || !formData.city || !formData.state || !formData.zipCode)) {
      alert("Please provide a complete shipping address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      
      // Prepare order items
      const orderItems = cartItems.map(item => {
        const productId = item.productId?._id || item.productId;
        const product = item.productId || {};
        return {
          productId,
          quantity: item.quantity,
          price: item.price,
        };
      });

      // Prepare shipping address
      const selectedAddr = addresses.find(addr => addr._id === selectedAddress);
      const shippingAddr = selectedAddr ? {
        name: selectedAddr.name,
        phone: selectedAddr.phone,
        street: selectedAddr.street,
        city: selectedAddr.city,
        state: selectedAddr.state,
        zipCode: selectedAddr.zipCode,
        country: selectedAddr.country,
      } : {
        name: formData.name,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      };

      // Create order
      const orderData = {
        items: orderItems,
        shippingAddress: shippingAddr,
        contactInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        subtotal,
        shippingFee,
        tax,
        totalPrice: total,
        paymentMethod: "cod",
      };

      const result = await OrderAPIService.createOrder(orderData);
      
      if (result.success) {
        setOrderPlaced(true);
      } else {
        throw new Error(result.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddAddress = async () => {
    try {
      const addressData = {
        name: formData.name,
        phone: formData.phone,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        isDefault: addresses.length === 0, // First address is default
      };

      const response = await AuthAPIService.addAddress(addressData);
      if (response.success) {
        setAddresses(response.addresses);
        if (response.addresses.length === 1) {
          setSelectedAddress(response.addresses[0]._id);
        }
        alert("Address added successfully!");
        setIsAddingAddress(false);
        // Reset form
        setFormData(prev => ({
          ...prev,
          address: "",
          city: "",
          state: "",
          zipCode: "",
        }));
      }
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Failed to add address: " + (err.message || "Please try again"));
    }
  };

  const handleCancelAddAddress = () => {
    setIsAddingAddress(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">Payment Method: <span className="font-semibold">Cash on Delivery</span></p>
              <p className="text-sm text-gray-700">
                Please have <span className="font-bold text-gray-900">${total.toFixed(2)}</span> ready for delivery.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/user'}
                className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
              >
                View Order Details
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Checkout</h1>
                <p className="text-xs text-gray-500">Complete your purchase</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Checkout Form */}
          <div className="lg:w-2/3">
            {/* Contact Information */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  <p className="text-sm text-gray-600 mt-1">How can we contact you about your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                  <p className="text-sm text-gray-600 mt-1">Where should we deliver your order?</p>
                </div>
              </div>

              {/* Select Address */}
              <div className="space-y-3 mb-6">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedAddress === address._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddress(address._id)}
                    >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{address.name}</h4>
                          {address.isDefault && (
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{address.street}</p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">{address.country}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-600">{address.phone}</span>
                        </div>
                      </div>
                      {selectedAddress === address._id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No saved addresses. Add one below.</p>
                )}
              </div>

              {/* Add New Address Button */}
              {!isAddingAddress ? (
                <button
                  onClick={() => setIsAddingAddress(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                >
                  + Add New Address
                </button>
              ) : (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">Add New Address</h4>
                    <button
                      onClick={handleCancelAddAddress}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">ZIP Code *</label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCancelAddAddress}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                  <p className="text-sm text-gray-600 mt-1">Choose how you want to pay</p>
                </div>
              </div>

              {/* Online Payments Unavailable Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Online Payments Currently Unavailable</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      We're upgrading our payment system. Please use Cash on Delivery for now.
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-4">
                {/* Cash on Delivery - Available */}
                <div className="border border-blue-500 rounded-lg p-4 bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white border border-blue-300 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Cash on Delivery</h4>
                        <p className="text-xs text-gray-600">Pay when you receive your order</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <span className="text-xs font-medium text-blue-600">Available</span>
                    </div>
                  </div>
                </div>

                {/* Credit/Debit Card - Disabled */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Credit/Debit Card</h4>
                        <p className="text-xs text-gray-400">Pay securely with your card</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Unavailable</span>
                  </div>
                </div>

                {/* PayPal - Disabled */}
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 opacity-60 cursor-not-allowed">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white border border-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#003087" d="M7.076 21.337H2.611a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.997 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.522 0-.97.382-1.052.9l-1.12 7.106z"/>
                          <path fill="#009cde" d="M21.946 6.6c-.23-.997-.578-1.937-1.046-2.813-1.209-2.077-3.12-3.723-6.246-3.723H5.997c-.522 0-.97.382-1.052.9L1.131 20.551a.641.641 0 0 0 .633.74h4.465a.902.902 0 0 0 .887-.734l.48-3.054.336-2.136a.902.902 0 0 1 .887-.734h2.19c4.298 0 7.664-1.747 8.647-6.796.03-.15.054-.295.077-.438.097-.496.117-.906.102-1.285z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">PayPal</h4>
                        <p className="text-xs text-gray-400">Pay with your PayPal account</p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-400">Unavailable</span>
                  </div>
                </div>
              </div>

              {/* Cash on Delivery Instructions */}
              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Cash on Delivery Instructions</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    Pay with cash when your order is delivered
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    Exact change is appreciated
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    Delivery personnel will provide a receipt
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                    Standard delivery time: 3-5 business days
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h3>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">Your cart is empty</p>
                  ) : (
                    cartItems.map((item) => {
                      const product = item.productId || {};
                      const productId = product._id || product.id || item.id;
                      const productName = product.name || item.name || "Product";
                      const productImage = product.image 
                        ? (product.image.startsWith('http') ? product.image : `./product/${product.image}`)
                        : "./product/iphone.png";
                      
                      return (
                        <div key={productId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                              <img
                                src={productImage}
                                alt={productName}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{productName}</p>
                              <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Cash on Delivery</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Please have <span className="font-bold">${total.toFixed(2)}</span> ready for the delivery personnel.
                  </p>
                </div>

                {/* Security Guarantee */}
                <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>Your information is secure and encrypted</span>
                </div>

                {/* Place Order Button */}
                <form onSubmit={handleSubmit} className="mt-6">
                  <button
                    type="submit"
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className="w-full py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    By placing your order, you agree to our Terms of Service
                  </p>
                </form>

                {/* Back to Cart */}
                <div className="mt-4 text-center">
                  <a
                    href="/cart"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    <Package className="w-4 h-4" />
                    Return to Cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="h-4"></div>
    </div>
  );
}

export default CheckoutPage;