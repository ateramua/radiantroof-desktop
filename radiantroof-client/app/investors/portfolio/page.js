'use client';
import { useState } from 'react';
import DealFlowDashboard from '@/components/DealFlowDashboard';
import PortfolioList from '@/components/PortfolioList';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function PortfolioPage() {
  const [activeView, setActiveView] = useState('dashboard');
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DashboardSidebar />
         {/* Dynamic Content - Wrapped to control width and alignment */}
        <div className="max-w-7xl mx-0"> {/* Changed from mx-auto to mx-0 for left alignment */}
          {activeView === 'dashboard' ? <DealFlowDashboard /> : <PortfolioList />}
        </div>
      
      {/* Main Content - Left aligned */}
      <div className="flex-1 p-8">
        {/* View Toggle Buttons - Left aligned */}
        <div className="flex gap-4 mb-8 justify-start"> {/* Changed from default to justify-start */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Deal Analyzer
          </button>
          <button
            onClick={() => setActiveView('portfolio')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'portfolio' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            My Portfolio
          </button>
        </div>
      </div>
    </div>
  );
}