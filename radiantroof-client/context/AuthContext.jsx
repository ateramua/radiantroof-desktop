// context/AuthContext.jsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
import { jwtDecode } from "jwt-decode"; // correct ESM import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { accessToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    setUser(jwtDecode(accessToken));
  };

  const logout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setUser(jwtDecode(token));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);