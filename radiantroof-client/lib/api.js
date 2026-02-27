import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // for refresh token cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Debug logging
  console.log('🚀 API Request:', {
    method: config.method.toUpperCase(),
    url: config.baseURL + config.url,
    data: config.data,
    headers: config.headers,
    token: token ? 'Present' : 'None'
  });
  
  return config;
});

// Response interceptor for debugging
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
    return Promise.reject(error);
  }
);

// Function to call server-side getProperties
export const getProperties = async () => {
  const res = await api.get("/properties"); // matches backend route
  return res.data;                          // return array of properties
};

export default api;