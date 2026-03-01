"use client";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QuickDealCalculator from "@/components/QuickDealCalculator";

export default function DashboardLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  <QuickDealCalculator />
  // Don't render anything if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  // User is authenticated - show the full dashboard layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Stays on the left */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        {/* Company Logo/Name */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">RadiantRoof</h2>
          <p className="text-sm text-gray-500">Fix & Flip Workflow</p>
        </div>
        
        {/* User Info - Shows who's logged in */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.email || 'User'}
              </p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <span>🏠</span>
              <span>Overview</span>
            </Link>
            
            {/* Pipeline Section */}
            <div className="pt-4 mt-4 border-t">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Pipeline
              </p>
            </div>
            
            <Link 
              href="/dashboard/pipeline" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <span>📊</span>
              <span>Pipeline View</span>
            </Link>
            
            {/* Workflow Stages */}
            <div className="pt-4 mt-4 border-t">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Workflow
              </p>
            </div>
            
            <Link 
              href="/dashboard/sourcing" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>🎯</span>
              <span>Sourcing</span>
              <span className="ml-auto text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                24
              </span>
            </Link>
            
            <Link 
              href="/dashboard/screening" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>🔍</span>
              <span>Screening</span>
              <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                12
              </span>
            </Link>
            
            <Link 
              href="/dashboard/analysis" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>📈</span>
              <span>Analysis</span>
              <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                8
              </span>
            </Link>
            
            <Link 
              href="/dashboard/acquisition" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>💰</span>
              <span>Acquisition</span>
              <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                3
              </span>
            </Link>
            
            <Link 
              href="/dashboard/renovation" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>🔨</span>
              <span>Renovation</span>
              <span className="ml-auto text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                2
              </span>
            </Link>
            
            <Link 
              href="/dashboard/exit" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition group"
            >
              <span>🏁</span>
              <span>Exit</span>
              <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                1
              </span>
            </Link>
            
            {/* Tools Section */}
            <div className="pt-4 mt-4 border-t">
              <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Tools
              </p>
            </div>
            
            <Link 
              href="/properties" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <span>🏘️</span>
              <span>Properties</span>
            </Link>
            
            <Link 
              href="/investors" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <span>🤝</span>
              <span>Investors</span>
            </Link>
            
            <Link 
              href="/admin" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
            >
              <span>⚙️</span>
              <span>Admin</span>
            </Link>
          </div>
        </nav>
        
        {/* Logout Button at Bottom */}
        <div className="p-4 border-t">
          <button 
            onClick={() => {
              // Add your logout logic here
              router.push('/logout');
            }}
            className="flex items-center space-x-2 p-2 w-full rounded hover:bg-red-50 text-gray-700 hover:text-red-600 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Top Header with Quick Actions */}
        <header className="bg-white shadow-sm px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Workflow Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Welcome back! Here's what's happening with your deals today.
              </p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center space-x-2">
                <span>➕</span>
                <span>Add Property</span>
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2">
                <span>📊</span>
                <span>Reports</span>
              </button>
              <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                <span>🔔</span>
              </button>
            </div>
          </div>
          
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t text-sm">
            <div>
              <p className="text-gray-500">Total Properties</p>
              <p className="text-xl font-semibold">48</p>
            </div>
            <div>
              <p className="text-gray-500">Active Deals</p>
              <p className="text-xl font-semibold text-green-600">12</p>
            </div>
            <div>
              <p className="text-gray-500">Potential Profit</p>
              <p className="text-xl font-semibold text-blue-600">$1.2M</p>
            </div>
            <div>
              <p className="text-gray-500">Avg ROI</p>
              <p className="text-xl font-semibold text-purple-600">24%</p>
            </div>
            <div>
              <p className="text-gray-500">Tasks Due</p>
              <p className="text-xl font-semibold text-orange-600">8</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 bg-gray-50">
          {children}
        </div>
      </main>
    </div>
  );
}