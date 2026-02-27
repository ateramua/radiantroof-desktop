"use client";

import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import InvestorEducationCenter from "@/components/InvestorEducationCenter";
import AIIntegrationShowcase from "@/components/AIIntegrationShowcase";

export default function InvestorDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || 'Investor'}!
          </h1>
          <p className="text-gray-600">
            Track your investments, discover opportunities, and master the RadiantRoof way
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Dashboard Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
                <p className="text-sm text-gray-500 mb-1">Portfolio Value</p>
                <p className="text-2xl font-bold text-blue-600">$0.00</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-green-500">
                <p className="text-sm text-gray-500 mb-1">Active Investments</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-purple-500">
                <p className="text-sm text-gray-500 mb-1">Total ROI</p>
                <p className="text-2xl font-bold text-purple-600">0%</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/properties" className="block">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                  <h3 className="text-lg font-bold mb-1">Browse Properties</h3>
                  <p className="text-sm text-blue-100">Discover new investment opportunities</p>
                </div>
              </Link>
              <Link href="/investors/portfolio" className="block">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg transition">
                  <h3 className="text-lg font-bold mb-1">My Portfolio</h3>
                  <p className="text-sm text-purple-100">View your current investments</p>
                </div>
              </Link>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="bg-white p-5 rounded-xl shadow-md">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <p className="text-sm text-gray-500">No recent activity to display</p>
            </div>
          </div>

          {/* Right Column - Education Center */}
          <div className="lg:col-span-1 space-y-8">
            <InvestorEducationCenter />
          </div>
        </div>

        {/* Bottom Row - AI Integration Showcase */}
        <div className="mt-8">
          <AIIntegrationShowcase />
        </div>
      </div>
    </div>
  );
}