"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { jwtDecode } from "jwt-decode";

// Create the context
const AuthContext = createContext(null);

// Provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

 const login = async (email, password) => {
  try {
    console.log('🔍 STEP 1: Login function called');
    console.log('📧 Email being sent:', email);
    console.log('🔑 Password being sent:', password ? '[REDACTED]' : 'empty');
    
    // Clear any existing token before login attempt
    localStorage.removeItem("accessToken");
    console.log('🔍 STEP 2: Cleared existing token');
    
    console.log('🔍 STEP 3: Making API request to /api/auth/login');
    console.log('🌐 API Base URL:', api.defaults.baseURL);
    
    // ✅ FIXED: Use the correct endpoint
    const res = await api.post("/api/auth/login", { email, password });
    
    console.log('✅ STEP 4: Response received!');
    console.log('📦 Response status:', res.status);
    console.log('📦 Response data:', JSON.stringify(res.data, null, 2));
    
    // Extract data from response
    const { token, user: userData } = res.data;
    
    console.log('🔍 STEP 5: Extracted token:', token ? '✅ Present' : '❌ Missing');
    console.log('🔍 STEP 6: Extracted userData:', userData ? '✅ Present' : '❌ Missing');
    
    if (!token) {
      console.error('❌ No token in response');
      throw new Error("No token received from server");
    }
    
    if (!userData) {
      console.error('❌ No user data in response');
      throw new Error("No user data received from server");
    }
    
    // Store token
    localStorage.setItem("accessToken", token);
    console.log('🔍 STEP 7: Token stored in localStorage');
    
    // Create user object from the response
    const fullUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      role: userData.role
    };
    
    console.log('🔍 STEP 8: Setting user:', fullUser);
    
    // Update state
    setUser(fullUser);
    console.log('🔍 STEP 9: User state updated');
    
    return fullUser;
    
  } catch (err) {
    console.error('❌ STEP ERROR: Login failed!');
    console.error('Error object:', err);
    
    if (err.response) {
      console.error('❌ Response status:', err.response.status);
      console.error('❌ Response data:', JSON.stringify(err.response.data, null, 2));
      const serverMessage = err.response.data?.message || err.response.data?.error || 'Invalid credentials';
      throw new Error(serverMessage);
    } else if (err.request) {
      console.error('❌ No response received. Request:', err.request);
      throw new Error('No response from server. Check that the API is reachable on port 5001 (127.0.0.1).');
    } else {
      console.error('❌ Request setup error:', err.message);
      throw err;
    }
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

  // Check for existing token on page load
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
        console.log('No token found, user not logged in');
        setLoading(false);
        return;
      }

      try {
        // Decode token to check expiration
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired, logging out");
          localStorage.removeItem("accessToken");
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ FIXED: Use token data directly - NO API CALL
        console.log('Using token data for user');
        setUser({
          id: decoded.id,
          email: decoded.email,
          role: decoded.role,
          name: decoded.email?.split('@')[0] || "User"
        });

      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("accessToken");
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeUser();
  }, []);

  // Create the value object
  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}