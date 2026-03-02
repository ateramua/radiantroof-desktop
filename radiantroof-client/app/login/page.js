"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("umoveez@gmail.com");
  const [password, setPassword] = useState("test");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Handle redirect when user is authenticated
  useEffect(() => {
    if (user) {
      console.log('🔄 User detected, redirecting based on role:', user.role);
      
      switch(user.role) {
        case 'admin':
          router.replace('/admin');
          break;
        case 'invest':
          router.replace('/investor');
          break;
        default:
          router.replace('/dashboard');
          break;
      }
    }
  }, [user, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");
    
    try {
      await login(email, password);
      // Redirect will be handled by the useEffect above
    } catch (err) {
      setError(err.message);
      setIsLoggingIn(false);
    }
  };

  // Show loading while logging in
  if (isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Logging you in...
          </p>
        </div>
      </div>
    );
  }

  // Don't show login form if user is already logged in (prevents flash)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 overflow-hidden">
        
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
        
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-4 drop-shadow-md">
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Log in to access your dashboard
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50"
          >
            {isLoggingIn ? "Logging in..." : "Sign In"}
          </button>
          {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          {/* <p className="text-xs text-gray-500 font-semibold mb-2">Demo Credentials:</p> */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-blue-50 rounded">
              <p className="font-medium">Admin</p>
              <p className="text-gray-600">umoveez@gmail.com</p>
              <p className="text-gray-400">test</p>
            </div>
            <div className="p-2 bg-green-50 rounded">
              <p className="font-medium">Investor</p>
              <p className="text-gray-600">invest@test.com</p>
              <p className="text-gray-400">password</p>
            </div>
            <div className="p-2 bg-purple-50 rounded col-span-2">
              <p className="font-medium">User</p>
              <p className="text-gray-600">user@test.com</p>
              <p className="text-gray-400">password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}