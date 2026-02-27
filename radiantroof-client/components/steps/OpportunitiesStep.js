import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchOpportunities, saveOpportunity, updateProperty } from "../../lib/api";

export default function OpportunitiesStep({ propertyId, updateMetrics, criteria }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    minROI: 0,
    maxPrice: 1000000,
    propertyType: "All",
    sortBy: "roi", // roi, price, score
    showOnlyMatches: true
  });
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOpportunities();
  }, [propertyId, filters]);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      // In real app, this would fetch from backend with filters
      // For demo, we'll use mock data
      setTimeout(() => {
        const mockOpportunities = [
          {
            id: 1,
            name: "Fixer-upper Special",
            address: "123 Main St",
            price: 180000,
            arv: 250000,
            repairCosts: 45000,
            roi: 18,
            cashOnCash: 12.5,
            capRate: 7.8,
            propertyType: "Single Family",
            bedrooms: 3,
            bathrooms: 2,
            squareFeet: 1500,
            yearBuilt: 1975,
            daysOnMarket: 45,
            location: "Downtown",
            schoolRating: 7,
            walkability: 8,
            status: "Active",
            score: 85,
            matchReason: "High ROI, within budget, good location",
            dealBreakers: [],
            recommendedAction: "STRONG BUY"
          },
          {
            id: 2,
            name: "Distressed Sale",
            address: "456 Oak Ave",
            price: 155000,
            arv: 220000,
            repairCosts: 35000,
            roi: 22,
            cashOnCash: 15.2,
            capRate: 8.5,
            propertyType: "Single Family",
            bedrooms: 2,
            bathrooms: 1,
            squareFeet: 1100,
            yearBuilt: 1960,
            daysOnMarket: 60,
            location: "Suburbs",
            schoolRating: 6,
            walkability: 4,
            status: "Active",
            score: 92,
            matchReason: "Exceptional ROI, below market price",
            dealBreakers: ["Older roof", "Galvanized plumbing"],
            recommendedAction: "STRONG BUY"
          },
          {
            id: 3,
            name: "Foreclosure Opportunity",
            address: "789 Pine Rd",
            price: 210000,
            arv: 275000,
            repairCosts: 40000,
            roi: 15,
            cashOnCash: 10.2,
            capRate: 6.9,
            propertyType: "Multi-Family",
            bedrooms: 4,
            bathrooms: 2,
            squareFeet: 2000,
            yearBuilt: 1985,
            daysOnMarket: 30,
            location: "Downtown",
            schoolRating: 8,
            walkability: 9,
            status: "Pending",
            score: 78,
            matchReason: "Good potential, strong location",
            dealBreakers: ["Multiple offers"],
            recommendedAction: "INVESTIGATE"
          },
          {
            id: 4,
            name: "Estate Sale",
            address: "321 Maple Dr",
            price: 195000,
            arv: 240000,
            repairCosts: 30000,
            roi: 12,
            cashOnCash: 8.5,
            capRate: 6.2,
            propertyType: "Townhouse",
            bedrooms: 3,
            bathrooms: 2.5,
            squareFeet: 1600,
            yearBuilt: 1990,
            daysOnMarket: 90,
            location: "Suburbs",
            schoolRating: 9,
            walkability: 5,
            status: "Active",
            score: 65,
            matchReason: "Good location, below average ROI",
            dealBreakers: ["High days on market"],
            recommendedAction: "MAYBE"
          },
          {
            id: 5,
            name: "Commercial Conversion",
            address: "555 Business Park",
            price: 350000,
            arv: 450000,
            repairCosts: 80000,
            roi: 16,
            cashOnCash: 11.2,
            capRate: 7.5,
            propertyType: "Commercial",
            bedrooms: 0,
            bathrooms: 2,
            squareFeet: 3000,
            yearBuilt: 1980,
            daysOnMarket: 120,
            location: "Industrial District",
            schoolRating: 4,
            walkability: 3,
            status: "Active",
            score: 45,
            matchReason: "High profit potential, location risk",
            dealBreakers: ["Zoning issues", "Environmental concerns"],
            recommendedAction: "PASS"
          }
        ];

        // Apply filters
        let filtered = mockOpportunities;

        if (filters.showOnlyMatches) {
          filtered = filtered.filter(opp => opp.score >= 70);
        }

        if (filters.minROI > 0) {
          filtered = filtered.filter(opp => opp.roi >= filters.minROI);
        }

        if (filters.maxPrice < 1000000) {
          filtered = filtered.filter(opp => opp.price <= filters.maxPrice);
        }

        if (filters.propertyType !== "All") {
          filtered = filtered.filter(opp => opp.propertyType === filters.propertyType);
        }

        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(opp => 
            opp.name.toLowerCase().includes(term) || 
            opp.address.toLowerCase().includes(term)
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          if (filters.sortBy === 'roi') return b.roi - a.roi;
          if (filters.sortBy === 'price') return a.price - b.price;
          if (filters.sortBy === 'score') return b.score - a.score;
          return 0;
        });

        setOpportunities(filtered);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Failed to load opportunities:", error);
      setLoading(false);
    }
  };

  const handleSelectOpportunity = (opportunity) => {
    setSelectedOpportunity(opportunity);
    if (updateMetrics) {
      updateMetrics({
        selectedOpportunity: opportunity.name,
        opportunityROI: opportunity.roi,
        opportunityScore: opportunity.score
      });
    }
  };

  const toggleCompare = (opportunity) => {
    if (compareList.find(o => o.id === opportunity.id)) {
      setCompareList(compareList.filter(o => o.id !== opportunity.id));
    } else {
      setCompareList([...compareList, opportunity]);
    }
  };

  const clearComparison = () => {
    setCompareList([]);
    setComparisonMode(false);
  };

  const handleSaveOpportunity = async (opportunity) => {
    try {
      await saveOpportunity(propertyId, opportunity);
      alert(`Opportunity "${opportunity.name}" saved to your pipeline`);
    } catch (error) {
      console.error("Failed to save opportunity:", error);
      alert("Error saving opportunity");
    }
  };

  const handleApplyToProperty = async (opportunity) => {
    try {
      // This would update the current property with opportunity data
      await updateProperty(propertyId, {
        price: opportunity.price,
        arv: opportunity.arv,
        repairCosts: opportunity.repairCosts,
        // ... other fields
      });
      alert(`Applied data from "${opportunity.name}" to current property`);
    } catch (error) {
      console.error("Failed to apply opportunity:", error);
      alert("Error applying opportunity data");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getActionBadge = (action) => {
    const badges = {
      'STRONG BUY': 'bg-green-100 text-green-800 border-green-200',
      'BUY': 'bg-blue-100 text-blue-800 border-blue-200',
      'INVESTIGATE': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'MAYBE': 'bg-orange-100 text-orange-800 border-orange-200',
      'PASS': 'bg-red-100 text-red-800 border-red-200'
    };
    return badges[action] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center justify-center h-40">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Finding matching opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Matching Opportunities</h3>
        {compareList.length > 0 && (
          <button
            onClick={clearComparison}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear Comparison ({compareList.length})
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="roi">Sort by ROI</option>
            <option value="score">Sort by Match Score</option>
            <option value="price">Sort by Price</option>
          </select>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min ROI (%)</label>
            <input
              type="number"
              value={filters.minROI}
              onChange={(e) => setFilters({...filters, minROI: Number(e.target.value)})}
              className="w-full p-1 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max Price ($)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
              className="w-full p-1 border rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Property Type</label>
            <select
              value={filters.propertyType}
              onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
              className="w-full p-1 border rounded"
            >
              <option value="All">All Types</option>
              <option value="Single Family">Single Family</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.showOnlyMatches}
                onChange={(e) => setFilters({...filters, showOnlyMatches: e.target.checked})}
                className="w-4 h-4"
              />
              <span className="text-sm">Show best matches only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Comparison Mode */}
      {comparisonMode && compareList.length > 1 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Property</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">ROI</th>
                <th className="p-2 text-right">Cash-on-Cash</th>
                <th className="p-2 text-right">Cap Rate</th>
                <th className="p-2 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {compareList.map(opp => (
                <tr key={opp.id} className="border-t">
                  <td className="p-2">{opp.name}</td>
                  <td className="p-2 text-right">${opp.price.toLocaleString()}</td>
                  <td className="p-2 text-right font-medium text-green-600">{opp.roi}%</td>
                  <td className="p-2 text-right">{opp.cashOnCash}%</td>
                  <td className="p-2 text-right">{opp.capRate}%</td>
                  <td className="p-2 text-right">
                    <span className={getScoreColor(opp.score)}>{opp.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-500">No matching opportunities found</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or criteria</p>
        </div>
      ) : (
        <div className="space-y-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className={`border rounded-lg p-4 hover:shadow-lg transition cursor-pointer ${
                selectedOpportunity?.id === opp.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => handleSelectOpportunity(opp)}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-lg">{opp.name}</h4>
                  <p className="text-gray-600 text-sm">{opp.address}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadge(opp.recommendedAction)}`}>
                    {opp.recommendedAction}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    opp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {opp.status}
                  </span>
                </div>
              </div>

              {/* Match Score and Key Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">Match Score</div>
                  <div className={`text-xl font-bold ${getScoreColor(opp.score)}`}>
                    {opp.score}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Price</div>
                  <div className="font-semibold">${opp.price.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">ARV</div>
                  <div className="font-semibold">${opp.arv.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Repair Costs</div>
                  <div className="font-semibold">${opp.repairCosts.toLocaleString()}</div>
                </div>
              </div>

              {/* ROI Metrics */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <div className="text-xs text-gray-500">ROI</div>
                  <div className="font-semibold text-green-600">{opp.roi}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cash-on-Cash</div>
                  <div className="font-semibold">{opp.cashOnCash}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Cap Rate</div>
                  <div className="font-semibold">{opp.capRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Days on Market</div>
                  <div className="font-semibold">{opp.daysOnMarket}</div>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">Type:</span> {opp.propertyType}
                </div>
                <div>
                  <span className="text-gray-500">Beds/Baths:</span> {opp.bedrooms}/{opp.bathrooms}
                </div>
                <div>
                  <span className="text-gray-500">Sq Ft:</span> {opp.squareFeet.toLocaleString()}
                </div>
                <div>
                  <span className="text-gray-500">Location:</span> {opp.location}
                </div>
              </div>

              {/* Location Quality */}
              <div className="flex gap-4 mb-3 text-sm">
                <div>
                  <span className="text-gray-500">School Rating:</span>
                  <span className="ml-1 font-medium">{opp.schoolRating}/10</span>
                </div>
                <div>
                  <span className="text-gray-500">Walkability:</span>
                  <span className="ml-1 font-medium">{opp.walkability}/10</span>
                </div>
              </div>

              {/* Match Reason */}
              <div className="mb-3 p-2 bg-green-50 rounded text-sm">
                <span className="font-medium text-green-700">Why it matches:</span> {opp.matchReason}
              </div>

              {/* Deal Breakers */}
              {opp.dealBreakers.length > 0 && (
                <div className="mb-3 p-2 bg-red-50 rounded text-sm">
                  <span className="font-medium text-red-700">⚠️ Deal Breakers:</span>
                  <ul className="list-disc list-inside mt-1">
                    {opp.dealBreakers.map((breaker, idx) => (
                      <li key={idx} className="text-red-600">{breaker}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveOpportunity(opp);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  Save to Pipeline
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplyToProperty(opp);
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                >
                  Apply to Current
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCompare(opp);
                    setComparisonMode(true);
                  }}
                  className={`px-3 py-1 border rounded text-sm ${
                    compareList.find(o => o.id === opp.id)
                      ? 'bg-purple-500 text-white border-purple-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {compareList.find(o => o.id === opp.id) ? 'Selected' : 'Compare'}
                </button>
                <Link
                  href={`/properties/${opp.id}`}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <div className="border-t pt-4">
        <div className="grid grid-cols-4 gap-4 text-sm">
          <div className="bg-blue-50 p-3 rounded text-center">
            <div className="text-xs text-blue-600">Total Opportunities</div>
            <div className="text-xl font-bold text-blue-700">{opportunities.length}</div>
          </div>
          <div className="bg-green-50 p-3 rounded text-center">
            <div className="text-xs text-green-600">Avg ROI</div>
            <div className="text-xl font-bold text-green-700">
              {opportunities.length > 0 
                ? Math.round(opportunities.reduce((acc, opp) => acc + opp.roi, 0) / opportunities.length) 
                : 0}%
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded text-center">
            <div className="text-xs text-purple-600">Avg Match Score</div>
            <div className="text-xl font-bold text-purple-700">
              {opportunities.length > 0 
                ? Math.round(opportunities.reduce((acc, opp) => acc + opp.score, 0) / opportunities.length) 
                : 0}
            </div>
          </div>
          <div className="bg-yellow-50 p-3 rounded text-center">
            <div className="text-xs text-yellow-600">Strong Buys</div>
            <div className="text-xl font-bold text-yellow-700">
              {opportunities.filter(o => o.recommendedAction === 'STRONG BUY').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}