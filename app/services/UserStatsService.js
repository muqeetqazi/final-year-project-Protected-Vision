import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { TokenManager } from './AuthService';

// Create axios instance for user stats API calls
const statsAPI = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
statsAPI.interceptors.request.use(
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
statsAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await TokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_CONFIG.BASE_URL}/auth/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await TokenManager.setTokens(access, refreshToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return statsAPI(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        await TokenManager.clearTokens();
        throw refreshError;
      }
    }

    return Promise.reject(error);
  }
);

export const UserStatsService = {
  // Get user profile with activity stats
  async getUserStats() {
    try {
      const response = await statsAPI.get('/auth/profile/');
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  },

  // Upload document (increments total_documents_saved)
  async uploadDocument(documentData) {
    try {
      const response = await statsAPI.post('/documents/', documentData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Upload document error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  },

  // Update document (increments total_documents_processed when processed=true)
  async updateDocument(documentId, updateData) {
    try {
      const response = await statsAPI.put(`/documents/${documentId}/`, updateData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Update document error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  },

  // Analyze document (increments detection counters)
  async analyzeDocument(analysisData) {
    try {
      const response = await statsAPI.post('/detection/analyze/', analysisData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Analyze document error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
      };
    }
  },

  // Share document (increments total_documents_shared)
  async shareDocument(shareData) {
    try {
      const response = await statsAPI.post('/documents/share/', shareData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Share document error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error),
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

export default UserStatsService;
