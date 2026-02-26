"use client"; // needed because AuthProvider is a client component

import { AuthProvider } from "../context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/app/page"; // import your Home server component
import "./globals.css";// Tailwind global styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          {/* Header always visible */}
          <Header />

          {/* Main content */}
          <main className="flex-1 container mx-auto px-4 py-8">
            <Home />
            {children} {/* any nested pages/components */}
          </main>

          {/* Footer always visible */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}