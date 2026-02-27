"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
const login = async (email, password) => {
  try {
    console.log('🔍 STEP 1: Login function called');
    console.log('🔍 STEP 2: Email:', email);
    console.log('🔍 STEP 3: Password length:', password?.length);
    
    // Check localStorage before login
    const existingToken = localStorage.getItem("accessToken");
    console.log('🔍 STEP 4: Existing token in localStorage:', existingToken ? 'Yes' : 'No');
    
    // Clear any existing token before login attempt
    localStorage.removeItem("accessToken");
    console.log('🔍 STEP 5: Cleared localStorage token');
    
    console.log('🔍 STEP 6: Making API request to /auth/login');
    const res = await api.post("/auth/login", { email, password });
    
    console.log('🔍 STEP 7: API response received:', {
      status: res.status,
      hasData: !!res.data,
      hasToken: !!res.data?.token
    });
    
    const { token } = res.data;
    if (!token) {
      throw new Error("No token received from server");
    }
    
    console.log('🔍 STEP 8: Token received, storing in localStorage');
    localStorage.setItem("accessToken", token);
    
    const decoded = jwtDecode(token);
    console.log('🔍 STEP 9: Token decoded:', decoded);
    
    setUser(decoded);
    console.log('🔍 STEP 10: User state updated');
    
    return decoded;
  } catch (err) {
    console.error('🔴 ERROR STEP: Login failed');
    console.error('🔴 Error name:', err.name);
    console.error('🔴 Error message:', err.message);
    console.error('🔴 Error response:', err.response?.data);
    console.error('🔴 Error status:', err.response?.status);
    console.error('🔴 Full error:', err);
    throw err;
  }
};

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired, logging out");
          localStorage.removeItem("accessToken");
          setUser(null);
        } else {
          setUser(decoded);
        }
      } catch (err) {
        console.error("Invalid token, clearing localStorage:", err);
        localStorage.removeItem("accessToken");
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};