"use client";

import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalProperties: 356,
    pendingApprovals: 23,
    monthlyRevenue: 124500,
    dealsClosed: 42
  });

  // Recent activities
  const recentActivities = [
    { id: 1, user: "John Smith", action: "Added new property", time: "2 min ago", status: "success" },
    { id: 2, user: "Sarah Johnson", action: "Updated user profile", time: "15 min ago", status: "info" },
    { id: 3, user: "Mike Chen", action: "Requested admin access", time: "1 hour ago", status: "warning" },
    { id: 4, user: "Emily Davis", action: "Closed deal #3421", time: "3 hours ago", status: "success" },
    { id: 5, user: "Robert Wilson", action: "Flagged for review", time: "5 hours ago", status: "error" },
  ];

  return (
    <div className="space-y-6">
      {/* FUNCTIONAL HEADER - Not an image! */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name || 'Admin'}. Here's what's happening today.
          </p>
        </div>
        
        {/* Functional Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/properties/AddProperties">
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition flex items-center space-x-2 shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add Property</span>
            </button>
          </Link>
          
          <Link href="/admin/users/invite">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2 shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Invite User</span>
            </button>
          </Link>
          
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center space-x-2 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% this month</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600 mt-1">{Math.round(stats.activeUsers/stats.totalUsers*100)}% of total</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Properties</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalProperties.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-1">↑ 8 new this week</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🏘️</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Pending Approvals</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingApprovals}</p>
              <p className="text-xs text-yellow-600 mt-1">Requires attention</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">⏳</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/users">
            <div className="border rounded-lg p-4 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer text-center">
              <span className="text-2xl block mb-2">👥</span>
              <span className="text-sm font-medium">Manage Users</span>
            </div>
          </Link>
          
          <Link href="/admin/properties">
            <div className="border rounded-lg p-4 hover:bg-green-50 hover:border-green-200 transition cursor-pointer text-center">
              <span className="text-2xl block mb-2">🏘️</span>
              <span className="text-sm font-medium">Property List</span>
            </div>
          </Link>
          
          <Link href="/admin/settings">
            <div className="border rounded-lg p-4 hover:bg-purple-50 hover:border-purple-200 transition cursor-pointer text-center">
              <span className="text-2xl block mb-2">⚙️</span>
              <span className="text-sm font-medium">Settings</span>
            </div>
          </Link>
          
          <Link href="/admin/reports">
            <div className="border rounded-lg p-4 hover:bg-orange-50 hover:border-orange-200 transition cursor-pointer text-center">
              <span className="text-2xl block mb-2">📊</span>
              <span className="text-sm font-medium">Reports</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Action</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Time</th>
                <th className="text-left py-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-sm font-medium">{activity.user}</td>
                  <td className="py-3 text-sm text-gray-600">{activity.action}</td>
                  <td className="py-3 text-sm text-gray-500">{activity.time}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activity.status === 'success' ? 'bg-green-100 text-green-800' :
                      activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                      activity.status === 'error' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <Link href="/admin/activity" className="text-sm text-blue-600 hover:underline">
            View All Activity →
          </Link>
        </div>
      </div>
    </div>
  );
}