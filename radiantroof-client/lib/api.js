import axios from "axios";
import https from "https";

// Function to get API base URL
const getApiBaseUrl = () => {
  // Check if running in Electron
  if (typeof window !== "undefined" && window.electronAPI) {
    // For Electron, assume port is available synchronously or use default
    // In practice, we might need to await, but for simplicity, use default and update later
    return "http://localhost:5001/api"; // Will be updated when port is fetched
  }
  // Fallback to environment or default
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api";
};

// Create HTTPS agent for production SSL verification
const httpsAgent = typeof window === "undefined" 
  ? new https.Agent({ rejectUnauthorized: true }) 
  : undefined; // browser handles SSL automatically

// Create axios instance
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  httpsAgent,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000,
});

// Function to update base URL when Electron port is available
export const updateApiBaseUrl = async () => {
  if (typeof window !== "undefined" && window.electronAPI) {
    try {
      const port = await window.electronAPI.getBackendPort();
      api.defaults.baseURL = `http://localhost:${port}/api`;
      console.log('Updated API base URL to:', api.defaults.baseURL);
    } catch (error) {
      console.warn('Failed to update API base URL:', error);
    }
  }
};

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log('🚀 API Request:', {
      method: config.method.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers,
      data: config.data,
      token: token ? 'Present' : 'None'
    });
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor: log responses and errors
api.interceptors.response.use(
  (response) => {
    if (process.env.NODE_ENV !== "production") {
      console.log('✅ API Response:', {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });

    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout – backend might be down');
    }

    return Promise.reject(error);
  }
);

// Helper function to fetch properties
export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export default api;