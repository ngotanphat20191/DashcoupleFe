import axios from "axios";

// Common axios defaults
axios.defaults.timeout = 30000; // Reduced timeout for better UX
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Cache for token to avoid repeated localStorage access
let cachedToken = null;

// Function to get token with caching
const getAuthToken = () => {
  if (!cachedToken) {
    cachedToken = localStorage.getItem("token");
  }
  return cachedToken;
};

// Clear token cache when needed
export const clearTokenCache = () => {
  cachedToken = null;
};

// Base API URLs
const API_BASE = 'http://localhost:8080/api';
const USER_API = `${API_BASE}/user`;
const ADMIN_API = `${API_BASE}/admin`;
const PAYMENT_API = 'http://localhost:10000/api/payment';

// Create axios instances with optimized settings
export const loginSignUpAxios = axios.create({
    baseURL: API_BASE,
    timeout: 30000,
});

export const loginAdminSignUpAxios = axios.create({
    baseURL: ADMIN_API,
    timeout: 30000,
});

export const baseAxios = axios.create({
    baseURL: USER_API,
    timeout: 30000,
});

export const adminAxios = axios.create({
    baseURL: ADMIN_API,
    timeout: 30000,
});

export const paymentAxios = axios.create({
    baseURL: PAYMENT_API,
    timeout: 30000,
});

// Common request interceptor function
const addAuthToken = (config) => {
    const token = getAuthToken();
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};

// Common response interceptor for error handling
const handleResponseError = (error) => {
    // Handle token expiration
    if (error.response && error.response.status === 401) {
        // Token expired, clear cache
        clearTokenCache();
    }
    return Promise.reject(error);
};

// Add request interceptors
baseAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));
adminAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));
paymentAxios.interceptors.request.use(addAuthToken, error => Promise.reject(error));

// Add response interceptors for error handling
baseAxios.interceptors.response.use(response => response, handleResponseError);
adminAxios.interceptors.response.use(response => response, handleResponseError);
paymentAxios.interceptors.response.use(response => response, handleResponseError);

// Enable request cancellation
export const createCancelToken = () => {
    return axios.CancelToken.source();
};
