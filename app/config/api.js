// API Configuration
export const API_CONFIG = {
  // Your DigitalOcean deployment URL
  BASE_URL: 'https://protective-vision-k58it.ondigitalocean.app/api',
  
  // Alternative URLs for different environments
  // BASE_URL: 'http://localhost:8000/api', // For local development
  // BASE_URL: 'http://192.168.1.100:8000/api', // For local network testing
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login/',
      REGISTER: '/auth/register/',
      REFRESH: '/auth/refresh/',
      PROFILE: '/auth/profile/',
      CHANGE_PASSWORD: '/auth/change-password/',
    },
    DOCUMENTS: {
      LIST: '/documents/',
      UPLOAD: '/documents/',
      DETAIL: '/documents/:id/',
    },
    DETECTION: {
      SCAN: '/detection/scan/',
      HISTORY: '/detection/history/',
    },
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 30000,
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000,
  },
};

export default API_CONFIG;
