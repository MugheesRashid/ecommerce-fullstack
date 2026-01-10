import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orders";

const orderAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
orderAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses
orderAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

class OrderAPIService {
  // Create order (from checkout)
  static async createOrder(orderData) {
    try {
      const response = await orderAPI.post("/", orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  // Get user orders
  static async getUserOrders(page = 1, limit = 10) {
    try {
      const response = await orderAPI.get("/user", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      const response = await orderAPI.get(`/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  }

  // Get order by order number
  static async trackOrder(orderNumber) {
    try {
      const response = await orderAPI.get(`/track/${orderNumber}`);
      return response.data;
    } catch (error) {
      console.error("Error tracking order:", error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId) {
    try {
      const response = await orderAPI.put(`/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  }
}

export default OrderAPIService;
