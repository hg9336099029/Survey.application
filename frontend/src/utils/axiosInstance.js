import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('🔗 API URL:', API_URL);

// Main axios instance for regular requests
export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000, // Increased from 10000
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('✅ Token added to request');
    }
    console.log('📤 Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('📥 Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Better CORS error handling
    if (error.message === 'Network Error' && !error.response) {
      console.error('🚫 Network Error detected - Check:');
      console.error('1. Backend is running on ' + API_URL);
      console.error('2. CORS is properly configured');
      console.error('3. Check firewall/proxy settings');
      error.message = 'Network error. Please ensure backend is running.';
    }

    return Promise.reject(error);
  }
);

// Separate instance for file uploads
export const axioscreatepoll = axios.create({
  baseURL: API_URL,
  timeout: 20000, // Longer timeout for file uploads
});

axioscreatepoll.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // Don't set Content-Type for multipart/form-data - let browser set it
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      console.log('📸 FormData detected - Content-Type will be set by browser');
    }
    return config;
  },
  (error) => {
    console.error('❌ Upload request error:', error);
    return Promise.reject(error);
  }
);

axioscreatepoll.interceptors.response.use(
  (response) => {
    console.log('✅ Upload successful');
    return response;
  },
  (error) => {
    console.error('❌ Upload error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);