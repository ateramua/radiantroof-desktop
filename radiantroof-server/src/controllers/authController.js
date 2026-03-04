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
      
      // Clear any existing token before login attempt
      localStorage.removeItem("accessToken");
      
      // Make login request
      const res = await api.post("/auth/login", { email, password });
      
      console.log('🔍 STEP 2: Login response:', res.data);
      
      // Now we get BOTH token and user data from backend
      const { accessToken, user: userData } = res.data;
      
      if (!accessToken) {
        throw new Error("No token received from server");
      }
      
      // Store token
      localStorage.setItem("accessToken", accessToken);
      
      // Create user object with ALL data from backend
      const fullUser = {
        id: userData.id,
        name: userData.name,        // This will be "Abdi Teramu"
        email: userData.email,       // This will be "umoveez@gmail.com"
        role: userData.role,         // This will be "admin"
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      };
      
      console.log('🔍 STEP 3: Setting user with name:', fullUser.name);
      console.log('🔍 STEP 4: Full user object:', fullUser);
      
      setUser(fullUser);
      return fullUser;
      
    } catch (err) {
      console.error('🔴 Login failed:', err);
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

  exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user'
    });
    
    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

  // Check for existing token on page load
  useEffect(() => {
    const initializeUser = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (!token) {
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

        // Token is valid, but we need the full user data
        // Option 1: If you have a /me endpoint, fetch fresh user data
        try {
          const userRes = await api.get("/auth/me");
          setUser(userRes.data);
        } catch (error) {
          // Option 2: Use token data as fallback
          setUser({
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            name: decoded.email?.split('@')[0] || "User"
          });
        }
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("accessToken");
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeUser();
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