"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

// app/admin/layout.js
"use client";

import Protected from "../../components/Protected";
import { AuthProvider } from "../../context/AuthContext";

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <Protected roles={["admin"]}>
        {children}
      </Protected>
    </AuthProvider>
  );
}