"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import DealImport from "@/components/sourcing/DealImport";
import WholesalerNetwork from "@/components/sourcing/WholesalerNetwork";
import ExpiredListingsMonitor from "@/components/sourcing/ExpiredListingsMonitor";
import { createDeal } from "@/lib/sourcing/models";
import CountyRecords from "@/components/sourcing/CountyRecords";

export default function SourcingPage() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState("TIER_1");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tiers"); // tiers, import, network, expired
  const [sourcingList, setSourcingList] = useState([]);

  // Tier data based on your design
  const tiers = {
    TIER_1: {
      name: "WARM LEADS",
      score: 92,
      acquisitionRate: "32%",
      color: "bg-green-500",
      leads: [
        { type: "Past Clients", count: 24, percentage: 35, color: "bg-green-600" },
        { type: "Expired Listings", count: 18, percentage: 26, color: "bg-green-500" },
        { type: "FSBO", count: 14, percentage: 20, color: "bg-green-400" },
        { type: "Probate", count: 12, percentage: 17, color: "bg-green-300" },
      ]
    },
    TIER_2: {
      name: "DISTRESSED",
      score: 68,
      acquisitionRate: "18%",
      color: "bg-yellow-500",
      leads: [
        { type: "Pre-Foreclosure", count: 15, percentage: 36, color: "bg-yellow-600" },
        { type: "Absentee Owners", count: 13, percentage: 31, color: "bg-yellow-500" },
        { type: "Tax Delinquent", count: 10, percentage: 24, color: "bg-yellow-400" },
        { type: "Investor Partners", count: 4, percentage: 9, color: "bg-yellow-300" },
      ]
    },
    TIER_3: {
      name: "COLD OUTREACH",
      score: 45,
      acquisitionRate: "5%",
      color: "bg-red-500",
      leads: [
        { type: "Geo Farming", count: 37, percentage: 43, color: "bg-red-600" },
        { type: "Open Houses", count: 24, percentage: 28, color: "bg-red-500" },
        { type: "Cold Calling", count: 20, percentage: 23, color: "bg-red-400" },
        { type: "Social Media", count: 6, percentage: 7, color: "bg-red-300" },
      ]
    }
  };

  // Sample leads list
  const leadsList = [
    { id: 1, name: "John Smith", address: "123 Main St", tier: "TIER_1", type: "Past Client", score: 95, lastContact: "2h ago", status: "Hot" },
    { id: 2, name: "Mary Johnson", address: "456 Oak Ave", tier: "TIER_1", type: "Expired Listing", score: 88, lastContact: "1d ago", status: "Warm" },
    { id: 3, name: "Robert Davis", address: "789 Pine St", tier: "TIER_2", type: "Pre-Foreclosure", score: 76, lastContact: "3d ago", status: "Contact" },
    { id: 4, name: "Sarah Wilson", address: "321 Elm St", tier: "TIER_2", type: "Absentee Owner", score: 72, lastContact: "5d ago", status: "New" },
    { id: 5, name: "Michael Brown", address: "654 Maple Ave", tier: "TIER_3", type: "Geo Farming", score: 45, lastContact: "1w ago", status: "Cold" },
  ];

  const filteredLeads = leadsList.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNewDeal = (deal) => {
    setSourcingList([deal, ...sourcingList].slice(0, 50));

    // Show notification
    alert(`✅ New deal added: ${deal.address || 'Property'} (Score: ${deal.score})`);
  };

  const handleBulkImport = (deals) => {
    setSourcingList([...deals, ...sourcingList].slice(0, 50));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Opportunity Sourcing</h1>
          <p className="text-sm text-gray-500 mt-1">
            Find and track leads across all your acquisition channels
          </p>
        </div>
        <div className="flex space-x-2">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {sourcingList.length} Active Leads
          </span>
        </div>
      </div>

      {/* Sourcing Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'tiers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📊 Acquisition Tiers
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📥 CSV Import
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'network'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            🤝 Wholesaler Network
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'expired'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
          >
            📉 Expired Listings
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tiers' && (
        <>
          {/* Tiered Acquisition Radar */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <span className="mr-2">📡</span>
                Acquisition Tier Radar
              </h2>
              <button className="text-sm text-gray-500 hover:text-gray-700">[FILTERS]</button>
            </div>

            {/* Tier Cards */}
            <div className="space-y-6">
              {Object.entries(tiers).map(([tierKey, tier]) => (
                <div
                  key={tierKey}
                  className={`border rounded-lg p-4 cursor-pointer transition ${selectedTier === tierKey ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedTier(tierKey)}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${tier.color}`}></span>
                      <h3 className="font-semibold">
                        {tier.name} ({tier.leads.reduce((acc, curr) => acc + curr.count, 0)} LEADS)
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">SCORE: {tier.score}</span>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        ACQ RATE: {tier.acquisitionRate}
                      </span>
                    </div>
                  </div>

                  {/* Lead bars */}
                  <div className="space-y-2">
                    {tier.leads.map((lead) => (
                      <div key={lead.type} className="group cursor-pointer hover:bg-gray-50 p-2 rounded transition">
                        <div className="flex justify-between text-sm mb-1">
                          <span>{lead.type}</span>
                          <span className="font-medium">{lead.count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${lead.color} h-2 rounded-full group-hover:opacity-80 transition`}
                            style={{ width: `${lead.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead Magnet Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Lead Tabs */}
            <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🧲</span>
                Lead Magnet
              </h2>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <nav className="flex space-x-8">
                  {["PAST CLIENTS", "EXPIRED LISTINGS", "PROBATE", "FSBO"].map((tab) => (
                    <button
                      key={tab}
                      className="py-2 px-1 border-b-2 border-transparent hover:border-blue-500 text-sm font-medium text-gray-500 hover:text-gray-700 transition"
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search leads by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Leads Table */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${lead.tier === "TIER_1" ? "bg-green-500" :
                          lead.tier === "TIER_2" ? "bg-yellow-500" : "bg-red-500"
                        }`}></div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs text-gray-400">{lead.type}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${lead.status === "Hot" ? "bg-red-100 text-red-800" :
                          lead.status === "Warm" ? "bg-yellow-100 text-yellow-800" :
                            lead.status === "Contact" ? "bg-blue-100 text-blue-800" :
                              lead.status === "New" ? "bg-green-100 text-green-800" :
                                "bg-gray-100 text-gray-800"
                        }`}>
                        {lead.status}
                      </span>
                      <span className="text-sm font-medium text-blue-600">{lead.score}</span>
                      <span className="text-xs text-gray-400">{lead.lastContact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Rate Predictor */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🎯</span>
                Success Rate Predictor
              </h2>

              {/* Main Score */}
              <div className="text-center mb-6">
                <div className="inline-block relative">
                  <svg className="w-32 h-32">
                    <circle
                      className="text-gray-200"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                    />
                    <circle
                      className="text-green-500"
                      strokeWidth="8"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="56"
                      cx="64"
                      cy="64"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * 0.13}`}
                      transform="rotate(-90 64 64)"
                    />
                  </svg>
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-bold text-gray-800">
                    87
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">HOT LEAD SCORE</p>
              </div>

              {/* Factors */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Motivation</span>
                    <span className="font-medium text-green-600">High</span>
                  </div>
                  <p className="text-xs text-gray-500">Divorce Filing Detected</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Timeline</span>
                    <span className="font-medium text-yellow-600">Urgent</span>
                  </div>
                  <p className="text-xs text-gray-500">30-60 days</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Equity</span>
                    <span className="font-medium text-green-600">$145K</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Contactability</span>
                    <span className="font-medium text-blue-600">5x calls</span>
                  </div>
                  <p className="text-xs text-gray-500">Last week</p>
                </div>
              </div>

              {/* Recommended Strategy */}
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 font-semibold mb-2">🔴 PRIORITY 1</p>
                <p className="text-sm font-medium mb-1">Call within 2 hours</p>
                <p className="text-xs text-gray-600">Offer: Quick Close + Cleanout Assistance</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold">197</p>
              <p className="text-xs text-green-600 mt-1">↑ 12% this week</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <p className="text-2xl font-bold">18%</p>
              <p className="text-xs text-green-600 mt-1">↑ 3% vs last month</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-bold">2.4h</p>
              <p className="text-xs text-green-600 mt-1">↓ 30min improvement</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-500">Cost Per Lead</p>
              <p className="text-2xl font-bold">$24</p>
              <p className="text-xs text-red-600 mt-1">↑ $2 vs target</p>
            </div>
          </div>
        </>
      )}

      {activeTab === 'import' && (
        <DealImport onDealsImported={handleBulkImport} />
      )}

      {activeTab === 'network' && (
        <WholesalerNetwork onNewDeal={handleNewDeal} />
      )}

      {activeTab === 'expired' && (
        <ExpiredListingsMonitor onNewDeal={handleNewDeal} />
      )}

      {/* 👇 ADD THIS NEW SECTION FOR COUNTY RECORDS */}
      {activeTab === 'county' && (
        <CountyRecords onNewDeal={handleNewDeal} />
      )}

      {/* Recent Activity Feed */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            <span className="text-gray-600">New expired listing imported:</span>
            <span className="ml-1 font-medium">123 Main St</span>
            <span className="ml-2 text-gray-400">• 10 min ago</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-gray-600">Deal from wholesaler</span>
            <span className="ml-1 font-medium">Michael R.</span>
            <span className="ml-2 text-gray-400">• 1 hour ago</span>
          </div>
          <div className="flex items-center text-sm">
            <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-gray-600">CSV import completed:</span>
            <span className="ml-1 font-medium">24 leads added</span>
            <span className="ml-2 text-gray-400">• 3 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}