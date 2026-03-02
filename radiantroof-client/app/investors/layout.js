"use client";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InvestorLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    // Allow both investors and admins to view investor pages
    if (!loading && user && user.role !== 'invest' && user.role !== 'admin') {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading investor portal...</p>
        </div>
      </div>
    );
  }

  if (!user || (user.role !== 'invest' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-green-600">Radiant Roof Realty</h2>
          <p className="text-sm text-gray-500">Investor Portal</p>
        </div>
        
        {/* Investor Info */}
        <div className="p-4 border-b bg-green-50">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'I'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.name || user?.email || 'Investor'}
              </p>
              <p className="text-xs text-green-600 font-semibold">
                {user?.role === 'admin' ? 'Admin (Viewing as Investor)' : 'Investor'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            <Link 
              href="/investor" 
              className="flex items-center space-x-2 p-2 rounded bg-green-50 text-green-700 font-medium transition"
            >
              <span>💰</span>
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/investor/portfolio" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <span>📊</span>
              <span>My Portfolio</span>
            </Link>
            
            <Link 
              href="/investor/properties" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <span>🏘️</span>
              <span>Funded Properties</span>
            </Link>
            
            <Link 
              href="/investor/returns" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <span>📈</span>
              <span>Returns & Projections</span>
            </Link>
            
            <Link 
              href="/investor/communications" 
              className="flex items-center space-x-2 p-2 rounded hover:bg-green-50 text-gray-700 hover:text-green-600 transition"
            >
              <span>💬</span>
              <span>Communications</span>
            </Link>

            {/* Admin can also access workflow */}
            {user?.role === 'admin' && (
              <>
                <div className="pt-4 mt-4 border-t">
                  <p className="px-2 text-xs font-semibold text-gray-400 uppercase">Admin Access</p>
                </div>
                <Link 
                  href="/dashboard" 
                  className="flex items-center space-x-2 p-2 rounded hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition"
                >
                  <span>🏠</span>
                  <span>Workflow Dashboard</span>
                </Link>
                <Link 
                  href="/admin" 
                  className="flex items-center space-x-2 p-2 rounded hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition"
                >
                  <span>⚙️</span>
                  <span>Admin Panel</span>
                </Link>
              </>
            )}
          </div>
        </nav>
        
        {/* Logout */}
        <div className="p-4 border-t">
          <button 
            onClick={() => router.push('/logout')}
            className="flex items-center space-x-2 p-2 w-full rounded hover:bg-red-50 text-gray-700 hover:text-red-600 transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Investor Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">
                Track your investments and returns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {user?.role === 'admin' ? 'Admin View' : 'Investor'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}