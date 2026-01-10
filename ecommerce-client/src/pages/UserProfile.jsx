import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  ShoppingBag,
  Package,
  Clock,
  Heart,
  Lock,
  Shield,
  LogOut,
  Trash2,
  Plus,
  CheckCircle,
  Eye,
  EyeOff,
  ChevronRight,
  CreditCard,
  AlertCircle,
  Loader,
  ShoppingCart,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AuthAPIService from "../services/authAPI";
import OrderAPIService from "../services/orderAPI";
import CartAPIService from "../services/cartAPI";

// ==================== User Information Component ====================
function ProfileInfo({ user, onUpdateUser, isLoading }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await onUpdateUser(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setError("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Profile Information
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your personal details
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              ) : (
                <div className="flex items-center gap-3 p-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {user.fullname || "N/A"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled
                />
              ) : (
                <div className="flex items-center gap-3 p-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {user.email || "N/A"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <div className="flex items-center gap-3 p-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">
                    {user.phone || "Not provided"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Profile Picture and Join Date */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
                <User className="w-12 h-12 text-blue-600" />
              </div>
              {isEditing && (
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Change Photo
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-gray-600">Total Orders</span>
                <span className="font-medium text-gray-900">
                  {user.orderCount || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

// ==================== Order History Component ====================
function OrderHistory({ orders, isLoading }) {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    const colors = {
      delivered: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800",
      shipped: "bg-purple-100 text-purple-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
    };
    return colors[statusLower] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Order History</h3>
        <p className="text-sm text-gray-600 mt-1">Your recent purchases</p>
      </div>

      <div className="divide-y divide-gray-200">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div key={order._id || order.id} className="p-6 hover:bg-gray-50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() =>
                        setExpandedOrder(
                          expandedOrder === order._id ? null : order._id
                        )
                      }
                      className="text-gray-400 hover:text-gray-600 mt-1"
                    >
                      {expandedOrder === order._id ? (
                        <ChevronRight className="w-5 h-5 transform rotate-90" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          Order #{order._id?.slice(-6) || order.id}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status?.charAt(0).toUpperCase() +
                            order.status?.slice(1) || "Unknown"}
                        </span>
                        {order.status === "delivered" && (
                          <button className="text-xs text-blue-600 hover:text-blue-800">
                            Buy Again
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Order #{order.orderNumber || order._id?.slice(-6)} •
                        Placed on{" "}
                        {new Date(
                          order.orderDate || order.createdAt
                        ).toLocaleDateString()}{" "}
                        • Total: ${order.totalPrice?.toFixed(2) || "0.00"}
                      </p>

                      {expandedOrder === order._id && (
                        <div className="mt-4 border-l-2 border-gray-200 pl-4 space-y-3">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item, index) => {
                              const product = item.productId || {};
                              const productName =
                                product.name || item.name || "Product";
                              const productImage =
                                product.image || item.image || "";
                              return (
                                <div
                                  key={index}
                                  className="flex items-center gap-3"
                                >
                                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                    {productImage ? (
                                      <img
                                        src={
                                          productImage.startsWith("http")
                                            ? productImage
                                            : `./product/${productImage}`
                                        }
                                        alt={productName}
                                        className="w-full h-full object-contain p-1"
                                      />
                                    ) : (
                                      <Package className="w-full h-full p-2 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                      {productName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Quantity: {item.quantity} • Price: $
                                      {item.price?.toFixed(2) || "0.00"} each
                                    </p>
                                  </div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    $
                                    {(
                                      (item.price || 0) * (item.quantity || 1)
                                    ).toFixed(2)}
                                  </p>
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                <Package className="w-full h-full p-2 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Order Items
                                </p>
                                <p className="text-xs text-gray-500">
                                  No items found
                                </p>
                              </div>
                            </div>
                          )}
                          {order.shippingAddress && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-2">
                                Shipping Address:
                              </p>
                              <p className="text-xs text-gray-600">
                                {order.shippingAddress.street},{" "}
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.zipCode}
                              </p>
                              <p className="text-xs text-gray-600">
                                {order.shippingAddress.country}
                              </p>
                            </div>
                          )}
                          {order.trackingNumber && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">
                                Tracking Number:
                              </p>
                              <p className="text-xs text-gray-600 font-mono">
                                {order.trackingNumber}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 lg:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">
                      ${order.totalPrice?.toFixed(2) || "0.00"}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Package className="w-3 h-3" />
                      {order.items?.reduce(
                        (sum, item) => sum + (item.quantity || 0),
                        0
                      ) ||
                        order.quantity ||
                        1}{" "}
                      items
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.trackingNumber && (
                      <button className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Track: {order.trackingNumber}
                      </button>
                    )}
                    {order.status !== "delivered" &&
                      order.status !== "cancelled" && (
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order?"
                              )
                            ) {
                              try {
                                await OrderAPIService.cancelOrder(order._id);
                                alert("Order cancelled successfully");
                                fetchUserOrders();
                              } catch (err) {
                                alert(
                                  "Failed to cancel order: " +
                                    (err.response?.data?.message || err.message)
                                );
                              }
                            }
                          }}
                          className="text-xs px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                        >
                          Cancel Order
                        </button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No orders yet</p>
            <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Address Book Component ====================
function AddressBook({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
  isLoading,
}) {
  const [editingAddress, setEditingAddress] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const addressData = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      street: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      zipCode: formData.get("zipCode"),
      country: formData.get("country"),
      isDefault:
        formData.get("setDefault") === "on" ||
        (editingAddress ? editingAddress.isDefault : false),
    };

    try {
      if (editingAddress) {
        await onUpdateAddress(editingAddress._id, addressData);
        setEditingAddress(null);
      } else {
        await onAddAddress(addressData);
      }
      setIsAdding(false);
      e.target.reset();
    } catch (err) {
      alert("Failed to save address: " + (err.message || "Please try again"));
    }
  };

  const handleEdit = (address) => {
    setEditingAddress({
      ...address,
      address: address.street || address.address, // Map street to address for form
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setEditingAddress(null);
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Address Book
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your shipping addresses
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>
      </div>

      {/* Add/Edit Address Form */}
      {(isAdding || editingAddress) && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              {editingAddress ? "Edit Address" : "Add New Address"}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingAddress?.name}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={editingAddress?.phone}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                defaultValue={editingAddress?.address || editingAddress?.street}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  defaultValue={editingAddress?.city}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  defaultValue={editingAddress?.state}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipCode"
                  defaultValue={editingAddress?.zipCode}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                name="country"
                defaultValue={editingAddress?.country}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
              </select>
            </div>

            {!editingAddress && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="setDefault"
                  name="setDefault"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="setDefault"
                  className="ml-2 text-sm text-gray-700"
                >
                  Set as default address
                </label>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                {editingAddress ? "Update Address" : "Add Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses List */}
      <div className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
            <span className="text-gray-600">Loading addresses...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <div
                key={address._id || address.id}
                className={`border rounded-lg p-4 ${
                  address.isDefault
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {address.name}
                    </h4>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-600">
                        <CheckCircle className="w-3 h-3" />
                        Default Address
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(address)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this address?"
                            )
                          ) {
                            onDeleteAddress(address._id || address.id);
                          }
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{address.street || address.address}</span>
                  </div>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{address.phone}</span>
                  </div>
                </div>
                {!address.isDefault && (
                  <button
                    onClick={() => onSetDefault(address._id || address.id)}
                    className="mt-4 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {addresses.length === 0 && !isAdding && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No addresses saved</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800"
            >
              Add your first address
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== Wishlist Component ====================
function Wishlist({ items, onRemoveItem, onMoveToCart, isLoading }) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex items-center justify-center">
        <Loader className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span className="text-gray-600">Loading wishlist...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
            <p className="text-sm text-gray-600 mt-1">
              Items you've saved for later
            </p>
          </div>
          <span className="text-sm text-gray-600">
            {items?.length || 0} items
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items && items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.productId?._id || item.productId || item.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-300" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {item.productId?.name || item.name || "Product"}
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        $
                        {item.productId?.price?.toFixed(2) ||
                          item.price?.toFixed(2) ||
                          "0.00"}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded bg-green-100 text-green-800`}
                    >
                      In Stock
                    </span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => onMoveToCart(item)}
                      className="flex-1 text-sm px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() =>
                        onRemoveItem(
                          item.productId?._id || item.productId || item.id
                        )
                      }
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Your wishlist is empty</p>
              <button className="mt-3 text-sm text-blue-600 hover:text-blue-800">
                Browse Products
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== Security Component ====================
function SecuritySettings({ onChangePassword, isLoading }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match!");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      return;
    }

    try {
      await onChangePassword(formData.currentPassword, formData.newPassword);
      setSuccess("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message || "Failed to change password");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Manage your password and security
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-red-600">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-gap-2">
          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-green-600">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Security Tips
        </h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>
              Use a strong, unique password with letters, numbers, and symbols
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Never share your password with anyone</span>
          </li>
          <li className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Change your password regularly</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ==================== Main User Profile Component ====================
function UserProfile() {
  const [activeSection, setActiveSection] = useState("profile");
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    profile: false,
    orders: false,
    wishlist: false,
    password: false,
  });
  const [user, setUser] = useState({
    fullname: "Loading...",
    email: "Loading...",
    phone: "",
    createdAt: new Date(),
    orderCount: 0,
  });
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [addressesLoading, setAddressesLoading] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
    fetchUserOrders();
    fetchWishlist();
    fetchAddresses();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await AuthAPIService.getUserProfile();
      if (response.success || response.user) {
        const userData = response.user || response;
        setUser({
          ...userData,
          fullname: userData.fullname || "User",
          email: userData.email || "N/A",
          phone: userData.phone || "",
          createdAt: userData.createdAt || new Date(),
          orderCount: userData.orders?.length || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      alert("Failed to load profile: " + error.message);
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Fetch user orders
  const fetchUserOrders = async () => {
    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      const response = await OrderAPIService.getUserOrders();
      if (response.success || Array.isArray(response.orders)) {
        setOrders(response.orders || response.data?.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setLoading((prev) => ({ ...prev, wishlist: true }));
      const response = await AuthAPIService.getWishlist();
      if (response.success || Array.isArray(response.wishlist)) {
        setWishlist(response.wishlist || response.data?.wishlist || []);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading((prev) => ({ ...prev, wishlist: false }));
    }
  };

  // Update user profile
  const handleUpdateUser = async (updatedUser) => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      const response = await AuthAPIService.updateUserProfile({
        fullname: updatedUser.fullname,
        phone: updatedUser.phone,
        address: updatedUser.address,
      });
      if (response.success || response.user) {
        setUser(response.user || updatedUser);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update profile");
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Change password
  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      setLoading((prev) => ({ ...prev, password: true }));
      const response = await AuthAPIService.changePassword(
        currentPassword,
        newPassword
      );
      if (response.success) {
        return response;
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  // Add to wishlist
  const handleAddToWishlist = async (productId) => {
    try {
      const response = await AuthAPIService.addToWishlist(productId);
      if (response.success) {
        fetchWishlist();
        alert("Added to wishlist!");
      }
    } catch (error) {
      alert("Failed to add to wishlist: " + error.message);
    }
  };

  // Remove from wishlist
  const handleRemoveWishlistItem = async (itemId) => {
    try {
      const response = await AuthAPIService.removeFromWishlist(itemId);
      if (response.success) {
        setWishlist(
          wishlist.filter(
            (item) =>
              item.productId?._id !== itemId && item.productId !== itemId
          )
        );
        alert("Removed from wishlist!");
      }
    } catch (error) {
      alert("Failed to remove from wishlist: " + error.message);
    }
  };

  // Move to cart
  const handleMoveToCart = async (item) => {
    try {
      const productId = item.productId?._id || item.productId || item._id || item.id;
      const productName = item.productId?.name || item.name || "Product";
      
      // Add to cart
      const response = await CartAPIService.addToCart(productId, 1);
      
      if (response.success || response.cart) {
        alert(`Added ${productName} to cart!`);
        // Remove from wishlist
        await handleRemoveWishlistItem(productId);
      } else {
        alert('Failed to add to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart: ' + (error.response?.data?.message || error.message || 'Please try again'));
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await AuthAPIService.getAddresses();
      if (response.success || Array.isArray(response.addresses)) {
        setAddresses(response.addresses || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  // Add address
  const handleAddAddress = async (addressData) => {
    try {
      const response = await AuthAPIService.addAddress(addressData);
      if (response.success) {
        setAddresses(response.addresses || []);
        alert("Address added successfully!");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to add address");
    }
  };

  // Update address
  const handleUpdateAddress = async (addressId, addressData) => {
    try {
      const response = await AuthAPIService.updateAddress(
        addressId,
        addressData
      );
      if (response.success) {
        setAddresses(response.addresses || []);
        alert("Address updated successfully!");
      }
    } catch (error) {
      throw new Error(error.message || "Failed to update address");
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await AuthAPIService.deleteAddress(addressId);
      if (response.success) {
        setAddresses(response.addresses || []);
        alert("Address deleted successfully!");
      }
    } catch (error) {
      alert(
        "Failed to delete address: " + (error.message || "Please try again")
      );
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await AuthAPIService.setDefaultAddress(addressId);
      if (response.success) {
        setAddresses(response.addresses || []);
        alert("Default address updated!");
      }
    } catch (error) {
      alert(
        "Failed to set default address: " +
          (error.message || "Please try again")
      );
    }
  };

  // Logout
  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Logged out successfully!");
      navigate("/auth");
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-gray-900">My Account</h1>
              <p className="text-xs text-gray-500">
                Manage your profile and preferences
              </p>
            </div>
            <div className="cart flex flex-row items-center gap-0.5 cursor-pointer">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </button>{" "}
              <button
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
              </button>{" "}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sticky top-4">
              {/* User Summary */}
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.fullname}</h3>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Navigation */}
              <nav>
                <ul className="space-y-1">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeSection === section.id
                            ? "bg-blue-50 text-blue-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                        {section.id === "orders" && (
                          <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {orders.length}
                          </span>
                        )}
                        {section.id === "wishlist" && (
                          <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                            {wishlist.length}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Account Overview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-medium">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Wishlist Items</span>
                    <span className="font-medium">{wishlist.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Saved Addresses</span>
                    <span className="font-medium">{addresses.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4">
            {/* Mobile Navigation */}
            <div className="lg:hidden mb-6">
              <div className="flex overflow-x-auto gap-1 pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-full ${
                      activeSection === section.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Active Section */}
            {activeSection === "profile" && (
              <ProfileInfo
                user={user}
                onUpdateUser={handleUpdateUser}
                isLoading={loading.profile}
              />
            )}

            {activeSection === "orders" && (
              <OrderHistory orders={orders} isLoading={loading.orders} />
            )}

            {activeSection === "wishlist" && (
              <Wishlist
                items={wishlist}
                onRemoveItem={handleRemoveWishlistItem}
                onMoveToCart={handleMoveToCart}
                isLoading={loading.wishlist}
              />
            )}

            {activeSection === "addresses" && (
              <AddressBook
                addresses={addresses}
                onAddAddress={handleAddAddress}
                onUpdateAddress={handleUpdateAddress}
                onDeleteAddress={handleDeleteAddress}
                onSetDefault={handleSetDefaultAddress}
                isLoading={addressesLoading}
              />
            )}

            {activeSection === "security" && (
              <SecuritySettings
                onChangePassword={handleChangePassword}
                isLoading={loading.password}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile bottom spacing */}
      <div className="h-4"></div>
    </div>
  );
}

export default UserProfile;
