// app/layout.js
"use client";

import Header from "@/components/Header";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <Header />               {/* Your header stays intact */}
          <main className="flex-1"> {/* This renders the current route's page */}
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}