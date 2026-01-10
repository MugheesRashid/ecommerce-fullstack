import React, { useState, useEffect } from "react";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  LogOut,
  AlertCircle,
  Loader,
  XCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Setup axios interceptor for admin token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses globally
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  }
);

// ==================== Dashboard Component ====================
function DashboardStats({ products, orders, users, onLogout }) {
  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      trend: "up"
    },
    {
      title: "Total Orders",
      value: orders.filter(o => o.status !== 'cancelled').length,
      icon: ShoppingBag,
      color: "bg-green-500",
      change: "+8%",
      trend: "up"
    },
    {
      title: "Total Customers",
      value: users.length,
      icon: Users,
      color: "bg-purple-500",
      change: "+5%",
      trend: "up"
    },
    {
      title: "Revenue",
      value: `$${orders.reduce((sum, order) => sum + (order.total || 0), 0).toFixed(2)}`,
      icon: DollarSign,
      color: "bg-amber-500",
      change: "+18%",
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.title}</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.color} p-3 rounded-lg`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} mr-1`} />
            <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </span>
            <span className="text-xs text-gray-500 ml-2">from last month</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== Product Management Component ====================
function ProductManagement({ products, onAddProduct, onUpdateProduct, onDeleteProduct, isLoading }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const categories = ["All", "electronics", "clothing", "furniture", "accessories", "other"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target);
      const data = {
        name: formData.get("name"),
        category: formData.get("category"),
        price: parseFloat(formData.get("price")),
        discountedPrice: parseFloat(formData.get("discountedPrice")) || null,
        stock: parseInt(formData.get("stock")),
        image: formData.get("image"),
        description: formData.get("description"),
      };

      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setIsSubmitting(false);
        return;
      }

      if (editingProduct) {
        const response = await axios.put(
          `https://ecommerce-fullstack.up.railway.app/api/products/admin/update/${editingProduct._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onUpdateProduct(response.data.data);
      } else {
        const response = await axios.post(
          "https://ecommerce-fullstack.up.railway.app/api/products/admin/create",
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Add Product Response:", response);
        onAddProduct(response.data.data);
      }

      setIsAdding(false);
      setEditingProduct(null);
      e.target.reset();
    } catch (err) {
      console.error("Product save error - Full error:", err);
      console.error("Token being used:", token);
      console.error("Error response status:", err.response?.status);
      console.error("Error response data:", err.response?.data);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("adminToken");
      } else {
        setError(err.response?.data?.message || "Failed to save product");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingProduct(null);
    setError("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(
          `https://ecommerce-fullstack.up.railway.app/api/products/admin/delete/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        onDeleteProduct(productId);
      } catch (err) {
        alert("Failed to delete product: " + (err.response?.data?.message || err.message));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        <p className="text-gray-600">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Product Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 border-b border-red-200 bg-red-50 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {(isAdding || editingProduct) && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-medium text-gray-900">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h4>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct?.name}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="category"
                  defaultValue={editingProduct?.category}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Category</option>
                  {categories.filter(cat => cat !== "All").map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  step="0.01"
                  min="0"
                  defaultValue={editingProduct?.price}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Discounted Price ($)</label>
                <input
                  type="number"
                  name="discountedPrice"
                  step="0.01"
                  min="0"
                  defaultValue={editingProduct?.discountedPrice}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                min="0"
                defaultValue={editingProduct?.stock}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Image URL *</label>
              <input
                type="text"
                name="image"
                defaultValue={editingProduct?.image}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                rows="3"
                defaultValue={editingProduct?.description}
                required
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
                {editingProduct ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500 truncate max-w-xs">{product.description.substring(0, 50)}...</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                    {product.discountedPrice && <p className="text-xs text-gray-500 line-through">${product.discountedPrice.toFixed(2)}</p>}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{indexOfFirstProduct + 1}</span> to <span className="font-semibold">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 text-sm border border-gray-300 rounded-lg ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-2.5 py-1.5 text-sm rounded-lg ${currentPage === page ? 'bg-blue-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 text-sm border border-gray-300 rounded-lg ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Analytics Component ====================
function Analytics({ orders, products }) {
  const calculateMonthlyRevenue = () => {
    const monthlyData = {};
    orders.forEach(order => {
      const month = new Date(order.date || new Date()).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += order.total || 0;
    });
    return monthlyData;
  };

  const monthlyRevenue = calculateMonthlyRevenue();
  const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">Monthly Revenue</h4>
          <BarChart3 className="w-5 h-5 text-gray-400" />
        </div>
        <div className="h-48 flex items-end gap-2 mt-6">
          {Object.keys(monthlyRevenue).length > 0 ? (
            Object.entries(monthlyRevenue).map(([month, revenue]) => {
              const maxRevenue = Math.max(...Object.values(monthlyRevenue));
              const height = (revenue / maxRevenue) * 100;
              return (
                <div key={month} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-blue-500 rounded-t-lg" style={{ height: `${height}%` }} />
                  <span className="text-xs text-gray-500 mt-2">{month}</span>
                  <span className="text-xs font-medium text-gray-900 mt-1">${revenue.toFixed(0)}</span>
                </div>
              );
            })
          ) : (
            <div className="w-full flex items-center justify-center h-48">
              <p className="text-gray-500">No revenue data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold text-gray-900">Top Products</h4>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {topProducts.length > 0 ? (
            topProducts.map((product) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-gray-900">${product.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No products available</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== Order Management Component ====================
function OrderManagement({ orders, onUpdateOrder, isLoading, onRefresh }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const statuses = ["All", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter.toLowerCase();
    const matchesSearch = order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleStatusUpdate = async (orderId, newStatus, notes = "") => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `https://ecommerce-fullstack.up.railway.app/api/orders/admin/${orderId}/status`,
        { status: newStatus, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdateOrder(orderId, { status: newStatus });
      setSelectedOrder(null);
      if (onRefresh) onRefresh();
      alert("Order status updated successfully!");
    } catch (err) {
      alert("Failed to update order: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleTrackingUpdate = async (orderId) => {
    if (!trackingNumber.trim()) {
      alert("Please enter a tracking number");
      return;
    }
    try {
      setIsUpdating(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `https://ecommerce-fullstack.up.railway.app/api/orders/admin/${orderId}/tracking`,
        { trackingNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onUpdateOrder(orderId, { trackingNumber });
      setTrackingNumber("");
      setSelectedOrder(null);
      if (onRefresh) onRefresh();
      alert("Tracking number updated successfully!");
    } catch (err) {
      alert("Failed to update tracking: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <Loader className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
        <p className="text-gray-600">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Management</h3>
            <p className="text-sm text-gray-600 mt-1">Manage and track customer orders</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{order.orderNumber || order._id.slice(-8)}</p>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.userId?.fullname || order.contactInfo?.name || "N/A"}</p>
                    <p className="text-xs text-gray-500">{order.userId?.email || order.contactInfo?.email || ""}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm text-gray-900">{order.items?.length || 0} items</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">${order.totalPrice?.toFixed(2) || '0.00'}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="text-xs text-gray-500">{new Date(order.orderDate || order.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                    className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedOrder === order._id ? "Hide" : "Manage"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {(() => {
              const order = orders.find(o => o._id === selectedOrder);
              if (!order) return null;
              return (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Order Number</p>
                      <p className="text-sm text-gray-900">{order.orderNumber || order._id}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Order Items</p>
                      <div className="space-y-2">
                        {order.items?.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                                {item.productId?.image || item.image ? (
                                  <img
                                    src={(item.productId?.image || item.image).startsWith('http') 
                                      ? (item.productId?.image || item.image)
                                      : `./product/${item.productId?.image || item.image}`}
                                    alt={item.productId?.name || item.name}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <Package className="w-full h-full p-2 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.productId?.name || item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                              </div>
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                              ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Shipping Address</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {order.shippingAddress?.street}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                          {order.shippingAddress?.country}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Payment Method</p>
                        <p className="text-xs text-gray-600 mt-1">{order.paymentMethod?.toUpperCase() || 'N/A'}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Update Status</p>
                      <div className="flex flex-wrap gap-2">
                        {["confirmed", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusUpdate(order._id, status)}
                            disabled={isUpdating || order.status === status}
                            className={`text-xs px-3 py-1.5 rounded-lg ${
                              order.status === status
                                ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            } disabled:opacity-50`}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {order.status === "shipped" && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Tracking Number</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={trackingNumber}
                            onChange={(e) => setTrackingNumber(e.target.value)}
                            placeholder={order.trackingNumber || "Enter tracking number"}
                            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            onClick={() => handleTrackingUpdate(order._id)}
                            disabled={isUpdating}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            Update
                          </button>
                        </div>
                        {order.trackingNumber && (
                          <p className="text-xs text-gray-500 mt-1">Current: {order.trackingNumber}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== Main Admin Panel Component ====================
function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get("https://ecommerce-fullstack.up.railway.app/api/orders/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 }
      });
      setOrders(response.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");

        if (!token) {
          navigate("/admin/login");
          return;
        }

        const productsRes = await axios.get("https://ecommerce-fullstack.up.railway.app/api/products", {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 10000, page: 1 }
        });
        setProducts(productsRes.data.data || []);
        
        // Fetch orders
        await fetchOrders();
      } catch (err) {
        console.error("Failed to fetch data:", err);
        if (err.response?.status === 401) {
          navigate("/admin/login");
        } else {
          setError("Failed to load data. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddProduct = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setProducts(products.map(p => p._id === updatedProduct._id ? updatedProduct : p));
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p._id !== productId));
  };

  const handleUpdateOrder = (orderId, updates) => {
    setOrders(orders.map(o => o._id === orderId ? { ...o, ...updates } : o));
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminToken");
      navigate("/admin/login");
    }
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ];

  if (error && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg border border-red-200 p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 text-center mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 text-center text-sm mb-4">{error}</p>
          <button onClick={handleLogout} className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">E-commerce Management System</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        <aside className="hidden md:block w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-4">
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Products</span>
                  <span className="font-semibold">{products.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Value</span>
                  <span className="font-semibold">${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Low Stock</span>
                  <span className="font-semibold">{products.filter(p => p.stock < 10).length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-semibold">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-semibold">{orders.filter(o => o.status === 'pending').length}</span>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center p-2 rounded-lg ${activeTab === tab.id ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs mt-1">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {activeTab === "dashboard" && (
            <>
              <DashboardStats products={products} orders={orders} users={users} onLogout={handleLogout} />
              <Analytics orders={orders} products={products} />
            </>
          )}

          {activeTab === "products" && (
            <ProductManagement products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} onDeleteProduct={handleDeleteProduct} isLoading={isLoading} />
          )}

          {activeTab === "orders" && (
            <OrderManagement 
              orders={orders} 
              onUpdateOrder={handleUpdateOrder}
              isLoading={ordersLoading}
              onRefresh={fetchOrders}
            />
          )}
        </main>
      </div>

      <div className="h-16 md:h-0"></div>
    </div>
  );
}

export default AdminPanel;
