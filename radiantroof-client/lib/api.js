import axios from "axios";
import https from "https";

// Create HTTPS agent for production SSL verification
const httpsAgent = typeof window === "undefined" 
  ? new https.Agent({ rejectUnauthorized: true }) 
  : undefined; // browser handles SSL automatically

// Create axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api",
  withCredentials: true,
  httpsAgent,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000,
});

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