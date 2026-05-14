import axios from "axios";
import https from "https";

// Function to get API base URL
const getApiBaseUrl = () => {
  // Check if running in Electron
  if (typeof window !== "undefined" && window.electronAPI) {
    // For Electron, use default port initially - will be updated later
    return "http://localhost:5001";
  }
  // Fallback to environment or default
  return process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001";
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
      api.defaults.baseURL = `http://localhost:${port}`;
      console.log('✅ Updated API base URL to:', api.defaults.baseURL);
    } catch (error) {
      console.warn('⚠️ Failed to update API base URL:', error);
    }
  }
};

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  
  // Ensure URL starts with /api prefix
  if (!config.url.startsWith('/api/') && !config.url.includes('/api/')) {
    config.url = `/api${config.url.startsWith('/') ? config.url : '/' + config.url}`;
  }
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (process.env.NODE_ENV !== "production") {
    console.log('🚀 API Request:', {
      method: config.method.toUpperCase(),
      fullUrl: config.baseURL + config.url,
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
    
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to fetch properties
export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const createProperty = async (property) => {
  const res = await api.post("/properties", property);
  return res.data;
};

export const updateProperty = async (id, property) => {
  const res = await api.put(`/properties/${id}`, property);
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await api.delete(`/properties/${id}`);
  return res.data;
};

export const createUser = async (user) => {
  const res = await api.post("/users", user);
  return res.data;
};

export const updateUser = async (id, user) => {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export default api;