"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard');

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          RadiantRoof
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link href="/properties" className="hover:text-blue-600 transition">
            Properties
          </Link>
          <Link href="/investors" className="hover:text-blue-600 transition">
            Investors
          </Link>
          <Link href="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>

          {/* Auth-based buttons */}
          {user ? (
            <>
              {/* For admin users: Show "Admin" button only when NOT in admin section */}
              {user.role === 'admin' && !isAdminRoute && (
                <Link 
                  href="/admin" 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Admin
                </Link>
              )}
              
              {/* For regular users: Show "Dashboard" button only when NOT in dashboard section */}
              {user.role === 'user' && !isDashboardRoute && (
                <Link 
                  href="/dashboard" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
              )}

              {/* Logout button - always visible when logged in */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Sign Up Button - New */}
              <Link 
                href="/register" 
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Sign Up
              </Link>
              {/* Login Button */}
              <Link 
                href="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}