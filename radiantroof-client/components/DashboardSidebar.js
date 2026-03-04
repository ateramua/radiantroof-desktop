"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  const isActive = (href) =>
    pathname === href || pathname?.startsWith(href + "/");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userRole = user?.role || "user";
  const userName = user?.name || "User";

  const getRoleDisplay = () => {
    if (userRole === "admin") return "Admin";
    if (userRole === "investor") return "Investor";
    return "User";
  };

  const roleDisplay = getRoleDisplay();

  const getLinksByRole = () => {
    if (userRole === "admin") {
      return [
        { href: "/admin", label: "Admin Dashboard", icon: "📊" },
        { href: "/", label: "Back to Home Page", icon: "🏠", isHome: true },
        { href: "/dashboard", label: "Workflow Dashboard", icon: "🗂️" },
        { href: "/admin/users", label: "Users", icon: "👥" },
        { href: "/admin/properties", label: "Properties", icon: "🏢" },
        { href: "/admin/settings", label: "Settings", icon: "⚙️" },
      ];
    }
    return [
      { href: "/investors", label: "Portfolio", icon: "💼" },
      { href: "/investors/wallet", label: "Wallet", icon: "👛" },
      { href: "/investors/transactions", label: "Transactions", icon: "💳" },
      { href: "/investors/my-portfolio", label: "My Portfolio", icon: "📈" },
    ];
  };

  const links = getLinksByRole();

  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
  }, []);

  const toggleDarkMode = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    localStorage.setItem("darkMode", newDark);
    document.documentElement.classList.toggle("dark", newDark);
  };

  if (loading) {
    return (
      <aside className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        ☰
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300
        ${isCollapsed ? "w-20" : "w-72"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-white dark:bg-gray-900 shadow-xl flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
          {!isCollapsed && (
            <span className="font-bold text-xl text-blue-600">
              Radiant Roof
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block"
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>

        {/* User */}
        <div className="p-4 border-b dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold">{userName}</p>
                <p className="text-xs text-gray-500">{roleDisplay}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } p-3 rounded-lg transition
              ${
                isActive(link.href)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span>{link.icon}</span>
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t dark:border-gray-800 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left p-2 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}