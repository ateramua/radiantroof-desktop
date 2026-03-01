// app/page.js
"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4 py-12">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
          Welcome to RadiantRoof
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-md">
          Explore our platform, manage your investments, and track workflows seamlessly.  
          Sign in to access dashboards or create an account to get started.
        </p>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}