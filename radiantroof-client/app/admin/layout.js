"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";

// Animated gradient background component
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/30 to-teal-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
  </div>
);

// Glass morphism navigation item
const NavItem = ({ href, children, isActive = false }) => {
  return (
    <Link href={href}>
      <div className={`group relative px-4 py-2 rounded-xl transition-all duration-300 cursor-pointer
        ${isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <div className="relative z-10 flex items-center space-x-2 font-medium">
          {children}
        </div>
        {!isActive && (
          <div className="absolute inset-0 bg-white/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        )}
      </div>
    </Link>
  );
};

// Admin badge component
const AdminBadge = () => (
  <div className="relative">
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
    <div className="relative px-4 py-2 bg-white rounded-lg leading-none flex items-center space-x-2">
      <span className="text-purple-600 font-bold">👑</span>
      <span className="text-gray-700 font-semibold">Admin Access</span>
    </div>
  </div>
);

// Stats card for admin dashboard
const StatsCard = ({ title, value, icon, trend, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors[color]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colors[color]} rounded-bl-full opacity-20`}></div>
      
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl text-white">{icon}</span>
          </div>
          {trend && (
            <span className={`text-sm font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'} bg-white/50 backdrop-blur-sm px-2 py-1 rounded-full`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userRole = user?.role;

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('🚫 No user, redirecting to login');
        router.push("/login");
      } else if (user.role !== 'admin') {
        console.log('🚫 User is not admin, redirecting to home');
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="relative">
          {/* Animated loading spinner */}
          <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-20 h-20 border-4 border-t-blue-600 border-r-purple-600 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 relative">
      <GradientBackground />

      {/* Admin Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-white/50 backdrop-blur-sm'
      }`}>
        <div className="container mx-auto px-4">
          {/* Top bar with user info and quick actions */}
          <div className="flex justify-between items-center py-3 border-b border-gray-200/50">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span className="font-semibold text-gray-700">Admin Console</span>
              </div>
              <span className="text-sm text-gray-400">|</span>
              <span className="text-sm text-gray-500">{currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}</span>
            </div>
            
            <div className="flex items-center space-x-3">
              <AdminBadge />
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-700">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <div className="flex items-center justify-between py-2">
            <DashboardSidebar user={user} userRole={userRole} />
            
            <nav className="flex items-center space-x-1">
              <NavItem href="/admin" isActive={true}>
                <span>📊</span>
                <span>Dashboard</span>
              </NavItem>
              
              <NavItem href="/admin/users">
                <span>👥</span>
                <span>User Management</span>
              </NavItem>
              
              <NavItem href="/admin/properties">
                <span>📋</span>
                <span>Property Inventory</span>
              </NavItem>
              
              <div className="ml-4 relative group">
                <Link href="/admin/properties/AddProperties">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative px-5 py-2.5 bg-white rounded-xl leading-none flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-0.5">
                      <span className="text-lg text-green-600 group-hover:scale-110 transition-transform">➕</span>
                      <span className="font-semibold text-gray-700">Add Property</span>
                    </div>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Quick Stats Dashboard (only show on main admin page) */}
      {children?.props?.children?.type?.name === 'AdminDashboard' && (
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Total Properties" 
              value="247" 
              icon="🏢"
              trend={12}
              color="blue"
            />
            <StatsCard 
              title="Active Users" 
              value="1,284" 
              icon="👥"
              trend={8}
              color="green"
            />
            <StatsCard 
              title="Monthly Revenue" 
              value="$124.5K" 
              icon="💰"
              trend={-3}
              color="purple"
            />
            <StatsCard 
              title="Deals Closed" 
              value="42" 
              icon="🎯"
              trend={23}
              color="orange"
            />
          </div>
        </div>
      )}

      {/* Main Content Area with enhanced container */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-br from-green-400/10 to-teal-400/10 rounded-full blur-3xl -z-10"></div>
          
          {/* Content wrapper with glass effect */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            {children}
          </div>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="mt-auto border-t border-gray-200/50 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">© 2024 Radiant Roof Realty</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-sm text-gray-500">Admin v2.0</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-400 bg-white/50 px-3 py-1 rounded-full">
                Last backup: Today 02:34 AM
              </span>
              <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500">System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}