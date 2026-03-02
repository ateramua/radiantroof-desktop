"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Get user info
  const userRole = user?.role || "user";
  const userName = user?.name || "User";

  // Debug
  useEffect(() => {
    console.log("Sidebar - User from context:", user);
    console.log("Sidebar - User role:", userRole);
    console.log("Sidebar - User name:", userName);
  }, [user, userRole, userName]);

  // Determine role display name
  const getRoleDisplay = () => {
    if (userRole === "admin") return "Admin";
    if (userRole === "investor") return "Investor";
    return "User";
  };

  const roleDisplay = getRoleDisplay();

  // Define links based ONLY on user role
  const getLinksByRole = () => {
    if (userRole === "admin") {
      return [
        { href: "/admin", label: "Admin Dashboard", icon: "📊", badge: null },
        { href: "/dashboard", label: "Workflow Dashboard", icon: "🏠", badge: "Fix & Flip" },
        { href: "/admin/users", label: "Users", icon: "👥", badge: null },
        { href: "/admin/properties", label: "Properties", icon: "🏢", badge: null },
        { href: "/admin/settings", label: "Settings", icon: "⚙️", badge: null },
      ];
    } else {
      // For investors and regular users
      return [
        { href: "/investors", label: "Portfolio", icon: "💼", badge: null },
        { href: "/investors/wallet", label: "Wallet", icon: "👛", badge: null },
        { href: "/investors/transactions", label: "Transactions", icon: "💳", badge: null },
        { href: "/investors/my-portfolio", label: "My Portfolio", icon: "📈", badge: null },
      ];
    }
  };

  const links = getLinksByRole();

  // Check for dark mode preference
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isActiveLink = (href) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // Show loading state if auth is still loading
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

  // If no user is logged in, don't show sidebar
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Open menu"
      >
        <span className="text-xl">☰</span>
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:fixed top-0 left-0 h-full z-50
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-20" : "w-72"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          bg-white dark:bg-gray-900
          shadow-2xl lg:shadow-xl
          flex flex-col
          border-r border-gray-200 dark:border-gray-800
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Radiant Roof
              </span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-full flex justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
            </div>
          )}
          
          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="text-gray-500">{isCollapsed ? "→" : "←"}</span>
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <span className="text-gray-500">✕</span>
          </button>
        </div>

        {/* User Profile */}
        <div className={`
          px-4 py-4 border-b border-gray-200 dark:border-gray-800
          ${isCollapsed ? "text-center" : ""}
        `}>
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                  {roleDisplay}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <div className="space-y-2">
            {links.map((link) => {
              const isActive = isActiveLink(link.href);
              
              return (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setShowTooltip(link.href)}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Link
                    href={link.href}
                    className={`
                      flex items-center ${isCollapsed ? "justify-center" : "justify-start"} 
                      px-3 py-3 rounded-xl
                      transition-all duration-200
                      ${isActive 
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                      }
                      group
                    `}
                  >
                    <span className={`
                      ${isCollapsed ? "text-xl" : "text-lg mr-3"}
                      ${isActive ? "text-white" : "text-gray-500 dark:text-gray-400"}
                    `}>
                      {link.icon}
                    </span>
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 text-sm font-medium">{link.label}</span>
                        {link.badge && (
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-medium
                            ${isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                            }
                          `}>
                            {link.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                  
                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && showTooltip === link.href && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
                      {link.label}
                      <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="space-y-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`
                w-full flex items-center ${isCollapsed ? "justify-center" : "justify-start"} 
                px-3 py-2 rounded-xl
                text-gray-700 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all duration-200
              `}
            >
              <span className={`${isCollapsed ? "text-xl" : "text-lg mr-3"} ${isDarkMode ? "text-yellow-500" : "text-gray-500"}`}>
                {isDarkMode ? "☀️" : "🌙"}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center ${isCollapsed ? "justify-center" : "justify-start"} 
                px-3 py-2 rounded-xl
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-all duration-200
              `}
            >
              <span className={`${isCollapsed ? "text-xl" : "text-lg mr-3"}`}>🚪</span>
              {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}