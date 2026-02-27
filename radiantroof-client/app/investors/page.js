"use client";

import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function InvestorDashboard() {
  const { user } = useAuth();

  return (
    <div>
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name || 'Investor'}!
        </h1>
        <p className="text-gray-600">
          Track your investments and explore new opportunities
        </p>
      </div>

      {/* Stats Grid */}
      <h2 className="text-2xl font-bold mb-4">Investor Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-2">Portfolio Value</h3>
          <p className="text-3xl font-bold text-green-600">$0.00</p>
          <p className="text-sm text-gray-400 mt-2">Across all investments</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-2">Active Investments</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-400 mt-2">Properties</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <h3 className="text-gray-500 text-sm mb-2">Total ROI</h3>
          <p className="text-3xl font-bold text-purple-600">0%</p>
          <p className="text-sm text-gray-400 mt-2">Lifetime returns</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Link href="/investors/portfolio" className="block">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">My Portfolio</h3>
            <p className="text-blue-100">View and manage your property investments</p>
          </div>
        </Link>
        
        <Link href="/investors/transactions" className="block">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Transactions</h3>
            <p className="text-purple-100">Track your investment history and returns</p>
          </div>
        </Link>
        
        <Link href="/properties" className="block md:col-span-2">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-md hover:shadow-xl transition transform hover:scale-105">
            <h3 className="text-xl font-bold mb-2">Browse Properties</h3>
            <p className="text-green-100">Discover new investment opportunities</p>
          </div>
        </Link>
      </div>
    </div>
  );
}