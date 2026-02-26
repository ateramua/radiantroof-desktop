import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // for refresh token cookies
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Function to call server-side getProperties
export const getProperties = async () => {
  const res = await api.get("/properties"); // matches backend route
  return res.data;                          // return array of properties
};

export default api;