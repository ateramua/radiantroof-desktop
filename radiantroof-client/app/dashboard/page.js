"use client";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();

  // Sample data for each stage
  const stages = [
    { name: 'SOURCE', count: 24, color: 'bg-purple-500', description: 'LEADS', icon: '🎯', href: '/dashboard/sourcing' },
    { name: 'SCREEN', count: 12, color: 'bg-blue-500', description: 'PASSED SCREENING', icon: '🔍', href: '/dashboard/screening' },
    { name: 'ANALYZE', count: 8, color: 'bg-indigo-500', description: 'UNDER OFFER', icon: '📈', href: '/dashboard/analysis' },
    { name: 'ACQUIRE', count: 3, color: 'bg-green-500', description: 'CLOSED', icon: '💰', href: '/dashboard/acquisition' },
    { name: 'RENOVATE', count: 2, color: 'bg-yellow-500', description: 'ACTIVE REHAB', icon: '🔨', href: '/dashboard/renovation' },
    { name: 'EXIT', count: 1, color: 'bg-red-500', description: 'FOR SALE', icon: '🏁', href: '/dashboard/exit' },
  ];

  // Sample recent activities
  const recentActivities = [
    { id: 1, action: 'moved to', stage: 'ANALYZE', property: '123 Main St', time: '10 min ago', color: 'green' },
    { id: 2, action: 'added from', stage: 'Expired Listing', property: '456 Oak Ave', time: '1 hour ago', color: 'blue' },
    { id: 3, action: 'started renovation at', stage: '789 Pine St', property: '', time: '3 hours ago', color: 'yellow' },
  ];

  return (
    <div>
      {/* Welcome Section with User Name */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name || user?.email?.split('@')[0] || 'Investor'}!
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Here's your fix & flip pipeline overview
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Total Properties</p>
          <p className="text-2xl font-bold">48</p>
          <p className="text-xs text-green-600 mt-1">↑ 12% this week</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Active Deals</p>
          <p className="text-2xl font-bold">12</p>
          <p className="text-xs text-green-600 mt-1">↑ 3 new this month</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Potential Profit</p>
          <p className="text-2xl font-bold text-green-600">$1.2M</p>
          <p className="text-xs text-gray-500 mt-1">Across all stages</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Avg. ROI</p>
          <p className="text-2xl font-bold text-blue-600">24%</p>
          <p className="text-xs text-green-600 mt-1">↑ 5% vs target</p>
        </div>
      </div>

      {/* Kanban Pipeline View */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pipeline Stages</h2>
          <Link href="/dashboard/pipeline" className="text-sm text-blue-600 hover:underline">
            View Full Pipeline →
          </Link>
        </div>
        
        {/* Stage Cards - Horizontal Scroll */}
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <Link 
              key={stage.name} 
              href={stage.href}
              className="min-w-[280px] block hover:shadow-lg transition"
            >
              {/* Stage Header */}
              <div className="bg-white rounded-t-lg p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-block w-3 h-3 rounded-full ${stage.color}`}></span>
                    <span className="font-semibold text-gray-700">{stage.name}</span>
                    <span className="text-sm text-gray-500">{stage.icon}</span>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-sm font-medium">
                    {stage.count}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
              </div>

              {/* Stage Content - Sample Properties */}
              <div className="bg-gray-50 rounded-b-lg p-4 min-h-[200px] space-y-3">
                {/* Property Card 1 */}
                <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">123 Main St</p>
                      <p className="text-sm text-gray-500">Asking $325K</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Hot 🔥
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="text-gray-400">MLS# 123456</span>
                    <span className="text-gray-400">2h ago</span>
                  </div>
                </div>

                {/* Property Card 2 - Only show if count > 1 */}
                {stage.count > 1 && (
                  <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">456 Oak Ave</p>
                        <p className="text-sm text-gray-500">Asking $450K</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-gray-400">FSBO</span>
                      <span className="text-gray-400">1d ago</span>
                    </div>
                  </div>
                )}

                {/* Show "more items" indicator if needed */}
                {stage.count > 2 && (
                  <div className="text-center text-sm text-blue-600 hover:underline cursor-pointer pt-2">
                    +{stage.count - 2} more...
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions Row */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-700">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                <span>➕</span>
                <span>Add New Property</span>
              </button>
              <Link 
                href="/dashboard/sourcing"
                className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2"
              >
                <span>🎯</span>
                <span>Go to Sourcing</span>
              </Link>
              <Link 
                href="/dashboard/screening"
                className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2"
              >
                <span>🔍</span>
                <span>Go to Screening</span>
              </Link>
              <Link 
                href="/dashboard/analysis"
                className="border border-gray-300 px-4 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2"
              >
                <span>📈</span>
                <span>Go to Analysis</span>
              </Link>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-4 text-gray-700">Today's Tasks</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <div>
                    <p className="font-medium">Review 3 new leads</p>
                    <p className="text-sm text-gray-500">From expired listings</p>
                  </div>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  Due today
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <div>
                    <p className="font-medium">Call seller at 456 Oak Ave</p>
                    <p className="text-sm text-gray-500">Follow up on offer</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  2:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-4 text-gray-700">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full mt-2`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-800">{activity.property}</span>{' '}
                    {activity.action}{' '}
                    <span className="font-medium text-gray-800">{activity.stage}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 text-sm text-blue-600 hover:underline w-full text-center">
            View All Activity →
          </button>
        </div>
      </div>
    </div>
  );
}