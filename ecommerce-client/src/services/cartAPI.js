import axios from "axios";

const API_BASE_URL = "https://ecommerce-fullstack.up.railway.app/api/cart";

const cartAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
cartAPI.interceptors.request.use(
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
cartAPI.interceptors.response.use(
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

class CartAPIService {
  static async getCart() {
    try {
      const response = await cartAPI.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  }

  static async addToCart(productId, quantity) {
    try {
      const response = await cartAPI.post("/add", {
        productId,
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  static async updateCartItem(productId, quantity) {
    try {
      const response = await cartAPI.put(`/update/${productId}`, {
        quantity,
      });
      return response.data;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  }

  static async removeFromCart(productId) {
    try {
      const response = await cartAPI.delete(`/remove/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  static async clearCart() {
    try {
      const response = await cartAPI.delete("/clear");
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }
}

export default CartAPIService;
