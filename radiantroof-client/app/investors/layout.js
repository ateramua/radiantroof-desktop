"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
// import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function InvestorsLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Protect investors route - require authentication
  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log('🚫 No user, redirecting to login from investors');
        // Save the attempted URL to redirect back after login
        const returnUrl = encodeURIComponent('/investors');
        router.push(`/login?redirect=${returnUrl}`);
      } else if (user.role !== 'investor' && user.role !== 'admin') {
        // Allow both investors and admins to access investors section
        console.log('🚫 User not authorized for investors section');
        router.push("/");
      }
    }
  }, [user, loading, router]);

  // Show loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Don't render anything if not authenticated or not authorized
  if (!user || (user.role !== 'investor' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}