import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_CONFIG } from '../config/api';

// Base URL for your DigitalOcean backend
const BASE_URL = `${API_CONFIG.BASE_URL}/auth`;

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const TokenManager = {
  async setTokens(accessToken, refreshToken) {
    try {
      await AsyncStorage.setItem('access_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
    } catch (error) {
      console.error('Error saving tokens:', error);
    }
  },

  async getAccessToken() {
    try {
      return await AsyncStorage.getItem('access_token');
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  },

  async getRefreshToken() {
    try {
      return await AsyncStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  async clearTokens() {
    try {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },

  async setUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
};

// Request interceptor to add auth token
authAPI.interceptors.request.use(
  async (config) => {
    const token = await TokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
authAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await TokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${BASE_URL}/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await TokenManager.setTokens(access, refreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return authAPI(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        await TokenManager.clearTokens();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

// Authentication service
export const AuthService = {
  // Login user
  async login(email, password) {
    try {
      const response = await authAPI.post('/login/', {
        email,
        password,
      });

      const { access, refresh, ...userData } = response.data;
      
      // Store tokens and user data
      await TokenManager.setTokens(access, refresh);
      await TokenManager.setUserData(userData);

      return {
        success: true,
        user: userData,
        tokens: { access, refresh }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  },

  // Register user
  async register(userData) {
    try {
      const response = await authAPI.post('/register/', userData);
      
      return {
        success: true,
        message: 'Registration successful. Please login with your credentials.'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  },

  // Logout user
  async logout() {
    try {
      await TokenManager.clearTokens();
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: 'Failed to logout' };
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const token = await TokenManager.getAccessToken();
      const userData = await TokenManager.getUserData();
      return !!(token && userData);
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  },

  // Get current user data
  async getCurrentUser() {
    try {
      return await TokenManager.getUserData();
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    try {
      const response = await authAPI.post('/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  },

  // Get user profile
  async getUserProfile() {
    try {
      const response = await authAPI.get('/profile/');
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  },

  // Update user profile
  async updateUserProfile(userData) {
    try {
      const response = await authAPI.patch('/profile/', userData);
      await TokenManager.setUserData(response.data);
      return {
        success: true,
        user: response.data
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  },

  // Helper method to extract error messages
  getErrorMessage(error) {
    if (error.response?.data) {
      const data = error.response.data;
      
      // Handle validation errors
      if (typeof data === 'object') {
        const firstError = Object.values(data)[0];
        if (Array.isArray(firstError)) {
          return firstError[0];
        }
        return firstError || 'An error occurred';
      }
      
      return data.detail || data.message || 'An error occurred';
    }
    
    if (error.message) {
      return error.message;
    }
    
    return 'Network error. Please check your connection.';
  }
};

export default AuthService;
