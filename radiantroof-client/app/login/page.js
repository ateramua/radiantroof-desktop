"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  // If user is already logged in, redirect appropriately
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        console.log('🔄 Already logged in as admin, redirecting to /admin');
        window.location.href = '/admin';
      } else {
        console.log('🔄 Already logged in as user, redirecting to /dashboard');
        window.location.href = '/dashboard';
      }
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsRedirecting(true);
    
    try {
      const userData = await login(email, password);
      console.log('✅ Login successful:', userData);
      setError("");
      // Redirect will be handled by the useEffect above
    } catch (err) {
      console.error('❌ Login error:', err);
      setError("Invalid credentials");
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden hover:scale-105 transform transition-all duration-500">
        
        {/* Decorative Circles */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4 drop-shadow-md">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your dashboard and workflows
        </p>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition-all duration-300"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all duration-300"
            required
          />
          <button
            type="submit"
            disabled={isRedirecting}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
          >
            {isRedirecting ? "Redirecting..." : "Sign In"}
          </button>
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>

        {/* Navigation Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/")}
            className="bg-white px-6 py-3 rounded shadow hover:bg-gray-100 text-gray-700 font-medium transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}