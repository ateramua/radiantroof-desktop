"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useDeal } from "../../../context/DealContext";
import DealImport from "@/components/sourcing/DealImport";
import WholesalerNetwork from "@/components/sourcing/WholesalerNetwork";
import ExpiredListingsMonitor from "@/components/sourcing/ExpiredListingsMonitor";
import CountyRecords from "@/components/sourcing/CountyRecords";
import Link from "next/link";

// Deal Card Component
const DealCard = ({ deal, onMoveToScreening }) => (
  <div className="bg-white border rounded-lg p-4 hover:shadow-md transition cursor-pointer">
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-semibold">{deal.address}</h4>
        <p className="text-sm text-gray-500">{deal.type} • {deal.source}</p>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${
        deal.score >= 80 ? 'bg-green-100 text-green-800' :
        deal.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        Score: {deal.score}
      </span>
    </div>
    
    <div className="grid grid-cols-3 gap-2 text-sm mt-3">
      <div>
        <p className="text-gray-500">Asking</p>
        <p className="font-medium">${deal.askingPrice?.toLocaleString() || '—'}</p>
      </div>
      <div>
        <p className="text-gray-500">ARV</p>
        <p className="font-medium">${deal.arv?.toLocaleString() || '—'}</p>
      </div>
      <div>
        <p className="text-gray-500">Repairs</p>
        <p className="font-medium">${deal.quickRepairEstimate?.toLocaleString() || '—'}</p>
      </div>
    </div>
    
    <div className="flex justify-between items-center mt-3 pt-3 border-t">
      <span className="text-xs text-gray-400">Added {deal.addedAt}</span>
      <div className="flex space-x-2">
        <button className="text-xs text-gray-600 hover:text-gray-900">📋 Details</button>
        <Link href="/dashboard/screening">
          <button 
            onClick={() => onMoveToScreening(deal)}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Start Screening
          </button>
        </Link>
      </div>
    </div>
  </div>
);

// Quick Repair Preview Component
const QuickRepairPreview = ({ deal }) => {
  if (!deal.repairEstimate) return null;
  
  return (
    <div className="bg-blue-50 rounded-lg p-3 text-sm">
      <p className="font-medium mb-2">🔨 Quick Repair Estimate</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(deal.repairEstimate.majorSystems || {}).map(([system, data]) => (
          data.cost > 0 && (
            <div key={system} className="flex justify-between">
              <span className="capitalize text-gray-600">{system}:</span>
              <span className="font-medium">${data.cost.toLocaleString()}</span>
            </div>
          )
        ))}
      </div>
      <div className="border-t mt-2 pt-2 flex justify-between font-bold">
        <span>Total:</span>
        <span>${deal.quickRepairEstimate?.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default function SourcingPage() {
  const { user } = useAuth();
  const { createNewDeal, currentDeal, dealHistory } = useDeal();
  const [selectedTier, setSelectedTier] = useState("TIER_1");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("tiers"); // tiers, import, network, expired, county
  const [sourcingList, setSourcingList] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showRepairModal, setShowRepairModal] = useState(false);

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

  // Enhanced leads list with repair data
  const leadsList = [
    { 
      id: 1, 
      name: "John Smith", 
      address: "123 Main St", 
      tier: "TIER_1", 
      type: "Past Client", 
      score: 95, 
      lastContact: "2h ago", 
      status: "Hot",
      askingPrice: 325000,
      arv: 425000,
      quickRepairEstimate: 45000,
      repairEstimate: {
        majorSystems: {
          roof: { condition: "Fair", cost: 8000 },
          hvac: { condition: "Good", cost: 0 },
          electrical: { condition: "Poor", cost: 12000 },
          plumbing: { condition: "Good", cost: 0 },
          foundation: { condition: "Good", cost: 0 }
        },
        rooms: {
          kitchen: { condition: "Full Gut", cost: 25000 },
          bathroom1: { condition: "Full Gut", cost: 0 },
          bathroom2: { condition: "Cosmetic", cost: 0 },
          bedrooms: { condition: "Paint/Flooring", cost: 0 },
          living: { condition: "Paint/Flooring", cost: 0 },
          basement: { condition: "Waterproofing", cost: 0 }
        }
      }
    },
    { 
      id: 2, 
      name: "Mary Johnson", 
      address: "456 Oak Ave", 
      tier: "TIER_1", 
      type: "Expired Listing", 
      score: 88, 
      lastContact: "1d ago", 
      status: "Warm",
      askingPrice: 295000,
      arv: 385000,
      quickRepairEstimate: 35000,
      repairEstimate: {
        majorSystems: {
          roof: { condition: "Good", cost: 0 },
          hvac: { condition: "Fair", cost: 5000 },
          electrical: { condition: "Good", cost: 0 },
          plumbing: { condition: "Fair", cost: 5000 },
          foundation: { condition: "Good", cost: 0 }
        },
        rooms: {
          kitchen: { condition: "Cosmetic", cost: 5000 },
          bathroom1: { condition: "Partial Gut", cost: 15000 },
          bathroom2: { condition: "Good", cost: 0 },
          bedrooms: { condition: "Paint/Flooring", cost: 5000 },
          living: { condition: "Paint/Flooring", cost: 0 },
          basement: { condition: "Good", cost: 0 }
        }
      }
    },
    { 
      id: 3, 
      name: "Robert Davis", 
      address: "789 Pine St", 
      tier: "TIER_2", 
      type: "Pre-Foreclosure", 
      score: 76, 
      lastContact: "3d ago", 
      status: "Contact",
      askingPrice: 280000,
      arv: 365000,
      quickRepairEstimate: 28000
    },
    { 
      id: 4, 
      name: "Sarah Wilson", 
      address: "321 Elm St", 
      tier: "TIER_2", 
      type: "Absentee Owner", 
      score: 72, 
      lastContact: "5d ago", 
      status: "New",
      askingPrice: 310000,
      arv: 405000,
      quickRepairEstimate: 42000
    },
    { 
      id: 5, 
      name: "Michael Brown", 
      address: "654 Maple Ave", 
      tier: "TIER_3", 
      type: "Geo Farming", 
      score: 45, 
      lastContact: "1w ago", 
      status: "Cold",
      askingPrice: 265000,
      arv: 345000,
      quickRepairEstimate: 38000
    },
  ];

  const filteredLeads = leadsList.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle moving deal to screening - UPDATED with Deal Context
  const handleMoveToScreening = (lead) => {
    // Create a new deal in context
    const newDeal = createNewDeal({
      address: lead.address,
      ownerName: lead.name,
      askingPrice: lead.askingPrice,
      arv: lead.arv,
      quickRepairEstimate: lead.quickRepairEstimate,
      repairEstimate: lead.repairEstimate,
      source: lead.type,
      tier: lead.tier,
      score: lead.score,
      status: lead.status,
      fromSourcing: true,
      currentPhase: 'sourcing',
      lastContact: lead.lastContact
    });
    
    console.log('Created new deal:', newDeal);
  };

  // Handle new deal from import - UPDATED with Deal Context
  const handleNewDeal = (deal) => {
    const newDeal = createNewDeal({
      address: deal.address,
      ownerName: deal.ownerName || deal.name,
      askingPrice: deal.askingPrice,
      arv: deal.arv,
      quickRepairEstimate: deal.quickRepairEstimate,
      repairEstimate: deal.repairEstimate,
      source: deal.source || 'import',
      score: deal.score || 50,
      tier: 'TIER_2', // Default tier for imports
      status: 'New',
      currentPhase: 'sourcing',
      ...deal
    });
    
    setSourcingList(prev => [newDeal, ...prev].slice(0, 50));
    
    // Show notification
    alert(`✅ New deal added: ${deal.address || 'Property'} (Score: ${deal.score || 50})`);
  };

  // Handle bulk import - UPDATED with Deal Context
  const handleBulkImport = (deals) => {
    const newDeals = deals.map(deal => 
      createNewDeal({
        address: deal.address,
        ownerName: deal.ownerName,
        askingPrice: deal.askingPrice,
        arv: deal.arv,
        quickRepairEstimate: deal.quickRepairEstimate,
        source: 'bulk-import',
        score: 50,
        tier: 'TIER_2',
        status: 'New',
        currentPhase: 'sourcing',
        ...deal
      })
    );
    
    setSourcingList(prev => [...newDeals, ...prev].slice(0, 50));
    alert(`✅ ${deals.length} deals imported successfully`);
  };

  // Handle quick repair modal
  const handleQuickRepair = (lead) => {
    setSelectedDeal(lead);
    setShowRepairModal(true);
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
            {dealHistory.length} Total Deals
          </span>
          <Link href="/dashboard/screening">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              Go to Screening
            </button>
          </Link>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Sourcing</p>
          <p className="text-2xl font-bold">{leadsList.length}</p>
          <p className="text-xs text-gray-400">Active leads</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Screening</p>
          <p className="text-2xl font-bold">3</p>
          <p className="text-xs text-gray-400">In due diligence</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Analysis</p>
          <p className="text-2xl font-bold">2</p>
          <p className="text-xs text-gray-400">Under contract</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Renovation</p>
          <p className="text-2xl font-bold">1</p>
          <p className="text-xs text-gray-400">In progress</p>
        </div>
      </div>

      {/* Current Deal Indicator - Shows if a deal is active */}
      {currentDeal && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-blue-600">🔵</span>
            <p className="text-sm">
              <span className="font-medium">Active Deal:</span> {currentDeal.address} 
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Phase: {currentDeal.currentPhase}
              </span>
            </p>
          </div>
          <Link href={`/dashboard/${currentDeal.currentPhase}`}>
            <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
              Continue
            </button>
          </Link>
        </div>
      )}

      {/* Sourcing Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tiers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📊 Acquisition Tiers
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'import'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📥 CSV Import
          </button>
          <button
            onClick={() => setActiveTab('network')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'network'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🤝 Wholesaler Network
          </button>
          <button
            onClick={() => setActiveTab('expired')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expired'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            📉 Expired Listings
          </button>
          <button
            onClick={() => setActiveTab('county')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'county'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🏛️ County Records
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
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedTier === tierKey ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-gray-300'
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
                  <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-2 h-2 rounded-full ${
                        lead.tier === "TIER_1" ? "bg-green-500" :
                        lead.tier === "TIER_2" ? "bg-yellow-500" : "bg-red-500"
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{lead.name}</p>
                          <span className="text-sm font-medium text-blue-600 ml-2">{lead.score}</span>
                        </div>
                        <p className="text-sm text-gray-500">{lead.address}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-400">{lead.type}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            lead.status === "Hot" ? "bg-red-100 text-red-800" :
                            lead.status === "Warm" ? "bg-yellow-100 text-yellow-800" :
                            lead.status === "Contact" ? "bg-blue-100 text-blue-800" :
                            lead.status === "New" ? "bg-green-100 text-green-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {lead.status}
                          </span>
                          <span className="text-xs text-gray-400">{lead.lastContact}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuickRepair(lead)}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200"
                      >
                        🔨 Quick Repair
                      </button>
                      <Link href="/dashboard/screening">
                        <button
                          onClick={() => handleMoveToScreening(lead)}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                        >
                          Screen
                        </button>
                      </Link>
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

      {activeTab === 'county' && (
        <CountyRecords onNewDeal={handleNewDeal} />
      )}

      {/* Quick Repair Modal */}
      {showRepairModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Quick Repair Estimate</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedDeal.address}</p>
            
            <QuickRepairPreview deal={selectedDeal} />
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRepairModal(false)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link href="/dashboard/screening" className="flex-1">
                <button
                  onClick={() => {
                    handleMoveToScreening(selectedDeal);
                    setShowRepairModal(false);
                  }}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Proceed to Screening
                </button>
              </Link>
            </div>
          </div>
        </div>
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