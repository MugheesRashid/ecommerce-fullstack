import axios from 'axios';

// Set up API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ecommerce-fullstack.up.railway.app/api/auth';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

class AuthAPIService {
  /**
   * Get user profile
   */
  static async getUserProfile() {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userData) {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Change password
   */
  static async changePassword(oldPassword, newPassword) {
    try {
      const response = await apiClient.put('/user/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get user wishlist
   */
  static async getWishlist() {
    try {
      const response = await apiClient.get('/user/wishlist');
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Add product to wishlist
   */
  static async addToWishlist(productId) {
    try {
      const response = await apiClient.post('/user/wishlist', { productId });
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Remove product from wishlist
   */
  static async removeFromWishlist(productId) {
    try {
      const response = await apiClient.delete(`/user/wishlist/${productId}`);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get user orders
   */
  static async getUserOrders() {
    try {
      const response = await apiClient.get('/user/orders');
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Add new order
   */
  static async addOrder(orderData) {
    try {
      const response = await apiClient.post('/user/orders', orderData);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Get user addresses
   */
  static async getAddresses() {
    try {
      const response = await apiClient.get('/user/addresses');
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Add address
   */
  static async addAddress(addressData) {
    try {
      const response = await apiClient.post('/user/addresses', addressData);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Update address
   */
  static async updateAddress(addressId, addressData) {
    try {
      const response = await apiClient.put(`/user/addresses/${addressId}`, addressData);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Delete address
   */
  static async deleteAddress(addressId) {
    try {
      const response = await apiClient.delete(`/user/addresses/${addressId}`);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Set default address
   */
  static async setDefaultAddress(addressId) {
    try {
      const response = await apiClient.put(`/user/addresses/${addressId}/default`);
      return response.data;
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || error.message,
      };
    }
  }
}

export default AuthAPIService;
