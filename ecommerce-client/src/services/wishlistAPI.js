import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/auth/user/wishlist";

const wishlistAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
wishlistAPI.interceptors.request.use(
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
wishlistAPI.interceptors.response.use(
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

class WishlistAPIService {
  static async getWishlist() {
    try {
      const response = await wishlistAPI.get("/");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  }

  static async addToWishlist(productId) {
    try {
      const response = await wishlistAPI.post("/", {
        productId,
      });
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }

  static async removeFromWishlist(productId) {
    try {
      const response = await wishlistAPI.delete(`/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  }
}

export default WishlistAPIService;
