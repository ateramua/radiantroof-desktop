"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Admin Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6">
            <Link 
              href="/admin" 
              className="py-4 px-2 text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link 
              href="/admin/users" 
              className="py-4 px-2 text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              User Management
            </Link>
            <Link 
              href="/admin/properties" 
              className="py-4 px-2 text-gray-700 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition"
            >
              Properties
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}