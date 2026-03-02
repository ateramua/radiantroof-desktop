"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import QuickDealCalculator from "./QuickDealCalculator";
import { useState } from "react"; // ← Make sure this is here!

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showCalculator, setShowCalculator] = useState(false); // ← This defines the state

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isInvestorRoute = pathname?.startsWith('/investor');

  return (
    <>
      <header className="bg-white shadow-md">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Radiant Roof Realty
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
                 {/* Quick Deal Calculator Button */}
            <button
              onClick={() => setShowCalculator(true)} // ← This now works!
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
            >
              <span>🧮</span>
              <span>Quick Deal Calculator</span>
            </button>
            {/* Auth-based buttons */}
            {user ? (
              <>
                {/* WORKFLOW DASHBOARD LINK */}
                {!isDashboardRoute && (
                  <Link
                    href="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-1"
                  >
                    <span>🏠</span>
                    <span>Workflow</span>
                  </Link>
                )}

                {/* Admin button */}
                {user.role === 'admin' && !isAdminRoute && (
                  <Link
                    href="/admin"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center space-x-1"
                  >
                    <span>⚙️</span>
                    <span>Admin</span>
                  </Link>
                )}

                {/* Investor button */}
                {user.role === 'invest' && !isInvestorRoute && (
                  <Link
                    href="/investor"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center space-x-1"
                  >
                    <span>💰</span>
                    <span>Investor</span>
                  </Link>
                )}

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition flex items-center space-x-1"
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/register"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Sign Up
                </Link>
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

      {/* Quick Deal Calculator Modal */}
      <QuickDealCalculator 
        isOpen={showCalculator} 
        onClose={() => setShowCalculator(false)} 
      />
    </>
  );
}