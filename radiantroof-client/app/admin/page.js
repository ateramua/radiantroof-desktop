'use client';
import DashboardSidebar from "@/components/DashboardSidebar";
import PropertyManagement from "@/components/PropertyManagement";
import { useState } from "react";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview'); // overview, properties, users, etc.
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <select 
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="overview">Overview</option>
                <option value="properties">Property Management</option>
                <option value="users">User Management</option>
                <option value="analytics">Analytics</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <DashboardSidebar/>
          </div>
          
          {/* Main Content Area */}
          <div className="col-span-9">
            {activeSection === 'overview' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-white p-4 rounded shadow">
                    <h3>Total Properties</h3>
                    <p className="text-xl">⏳</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3>Total Users</h3>
                    <p className="text-xl">⏳</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3>Active Deals</h3>
                    <p className="text-xl">⏳</p>
                  </div>
                  <div className="bg-white p-4 rounded shadow">
                    <h3>Revenue</h3>
                    <p className="text-xl">⏳</p>
                  </div>
                </div>
              </>
            )}
            
            {activeSection === 'properties' && (
              <PropertyManagement />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}