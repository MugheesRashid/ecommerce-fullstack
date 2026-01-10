import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/products';

// Create axios instance for product requests
const productClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
productClient.interceptors.request.use(
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

// Add response interceptor for error handling
productClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

class ProductAPIService {
  // Get all products with pagination
  static async getAllProducts(page = 1, limit = 10) {
    try {
      const response = await productClient.get('/', {
        params: { page, limit },
      });
      
      // Handle different response structures
      const result = response.data;
      if (result.data) return result.data;
      if (result.products) return { data: result.products, pagination: result.pagination };
      return result;
    } catch (error) {
      console.error('getAllProducts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  // Get product by ID
  static async getProductById(productId) {
    try {
      const response = await productClient.get(`/${productId}`);
      
      // Handle different response structures
      const result = response.data;
      if (result.data) return result.data;
      return result;
    } catch (error) {
      console.error('getProductById error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  // Get products by category
  static async getProductsByCategory(category, page = 1, limit = 10) {
    try {
      const response = await productClient.get(`/category/${category}`, {
        params: { page, limit },
      });
      
      // Handle different response structures
      const result = response.data;
      if (result.data) return result.data;
      if (result.products) return { data: result.products, pagination: result.pagination };
      return result;
    } catch (error) {
      console.error('getProductsByCategory error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }

  // Search products
  static async searchProducts(searchTerm, page = 1, limit = 10) {
    try {
      const response = await productClient.get(`/search/${searchTerm}`, {
        params: { page, limit },
      });
      
      // Handle different response structures
      const result = response.data;
      if (result.data) return result.data;
      if (result.products) return { data: result.products, pagination: result.pagination };
      return result;
    } catch (error) {
      console.error('searchProducts error:', error);
      throw new Error(error.response?.data?.message || 'Failed to search products');
    }
  }
}

export default ProductAPIService;
