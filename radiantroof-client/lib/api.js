import axios from "axios";

// Make sure this points to your backend
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5001/api",
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  console.log('🚀 API Request:', {
    method: config.method.toUpperCase(),
    url: config.baseURL + config.url,
    data: config.data,
    headers: config.headers,
    token: token ? 'Present' : 'None'
  });
  
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      }
    });
    
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout - backend might be down');
    }
    
    return Promise.reject(error);
  }
);

// Function to call server-side getProperties
export const getProperties = async () => {
  const res = await api.get("/properties");
  return res.data;
};

export default api;