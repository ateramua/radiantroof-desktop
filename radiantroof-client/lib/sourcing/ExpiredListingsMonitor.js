"use client";
import { useState, useEffect } from 'react';
import { createDeal } from '@/lib/sourcing/models';
import { ScoringEngine } from '@/lib/sourcing/scoringEngine';

// Mock MLS service - would be replaced with real API
const mockMLSService = {
  fetchExpiredListings: async (zipCodes) => {
    // Simulate API call
    return [
      {
        address: '123 Main St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
        lastPrice: 325000,
        originalPrice: 349000,
        daysOnMarket: 124,
        priceDrops: 3,
        bedrooms: 3,
        bathrooms: 2,
        sqft: 1850,
        yearBuilt: 1985,
        agentName: 'Jane Smith',
        agentPhone: '512-555-4321',
        expiredDate: '2024-03-15'
      },
      {
        address: '456 Oak Ave',
        city: 'Round Rock',
        state: 'TX',
        zip: '78664',
        lastPrice: 289000,
        originalPrice: 315000,
        daysOnMarket: 98,
        priceDrops: 2,
        bedrooms: 4,
        bathrooms: 2.5,
        sqft: 2100,
        yearBuilt: 1995,
        agentName: 'Bob Johnson',
        agentPhone: '512-555-8765',
        expiredDate: '2024-03-10'
      }
    ];
  }
};

export default function ExpiredListingsMonitor({ onNewDeal }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    zipCodes: ['78701', '78702', '78664', '78613'],
    minDiscount: 10, // Minimum % below original price
    maxDaysExpired: 30
  });

  const scoringEngine = new ScoringEngine();

  const fetchExpiredListings = async () => {
    setLoading(true);
    try {
      const data = await mockMLSService.fetchExpiredListings(filters.zipCodes);
      
      // Enhance with calculated fields
      const enhanced = data.map(listing => {
        const discount = ((listing.originalPrice - listing.lastPrice) / listing.originalPrice) * 100;
        
        // Estimate ARV (simplified - in reality would use comps)
        const estimatedArv = listing.lastPrice * 1.3; // Rough estimate
        
        // Estimate repairs (simplified)
        const estimatedRepairs = listing.sqft * 25;
        
        // Create deal object
        const deal = createDeal({
          address: listing.address,
          city: listing.city,
          state: listing.state,
          zip: listing.zip,
          askingPrice: listing.lastPrice,
          estimatedArv: Math.round(estimatedArv),
          estimatedRepairs: Math.round(estimatedRepairs),
          sourceType: 'expired_mls',
          sourceDetail: `Expired: ${listing.daysOnMarket} days, ${listing.priceDrops} price drops`,
          sourceContact: listing.agentName,
          notes: `Originally listed at $${listing.originalPrice}. DOM: ${listing.daysOnMarket}. Drops: ${listing.priceDrops}`,
          tags: ['expired', listing.priceDrops > 2 ? 'motivated' : '']
        });
        
        // Score the deal
        const scored = scoringEngine.scoreDeal(deal);
        deal.score = scored.score;
        deal.priority = scored.priority;
        deal.scoringSummary = scored.summary;
        
        return {
          ...listing,
          deal,
          discount: Math.round(discount * 10) / 10,
          estimatedArv,
          estimatedRepairs
        };
      });
      
      // Sort by score
      enhanced.sort((a, b) => b.deal.score - a.deal.score);
      
      setListings(enhanced);
    } catch (error) {
      console.error('Error fetching expired listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpiredListings();
  }, []);

  const importToList = (listing) => {
    if (onNewDeal) {
      onNewDeal(listing.deal);
      alert(`✅ Added ${listing.address} to your sourcing list!`);
    }
  };

  const importAll = () => {
    if (onNewDeal) {
      listings.forEach(listing => onNewDeal(listing.deal));
      alert(`✅ Added ${listings.length} expired listings to your sourcing list!`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">📉 MLS Expired Listings</h3>
        <div className="flex space-x-2">
          <button
            onClick={fetchExpiredListings}
            disabled={loading}
            className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            {loading ? 'Refreshing...' : '↻ Refresh'}
          </button>
          {listings.length > 0 && (
            <button
              onClick={importAll}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Import All
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 p-3 bg-gray-50 rounded">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">ZIP Codes</label>
            <input
              type="text"
              value={filters.zipCodes.join(', ')}
              onChange={(e) => setFilters({...filters, zipCodes: e.target.value.split(',').map(z => z.trim())})}
              className="w-full border rounded px-2 py-1 text-sm"
              placeholder="78701, 78702"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Min Discount %</label>
            <input
              type="number"
              value={filters.minDiscount}
              onChange={(e) => setFilters({...filters, minDiscount: e.target.value})}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Max Days Expired</label>
            <input
              type="number"
              value={filters.maxDaysExpired}
              onChange={(e) => setFilters({...filters, maxDaysExpired: e.target.value})}
              className="w-full border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Loading expired listings...</p>
        </div>
      ) : listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((listing, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold">{listing.address}</h4>
                  <p className="text-sm text-gray-500">{listing.city}, {listing.state} {listing.zip}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  listing.deal.priority === 'hot' ? 'bg-red-100 text-red-800' :
                  listing.deal.priority === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {listing.deal.priority.toUpperCase()} • Score: {listing.deal.score}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Last Price</p>
                  <p className="font-medium">${listing.lastPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Original</p>
                  <p className="font-medium">${listing.originalPrice.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Discount</p>
                  <p className="font-medium text-green-600">{listing.discount}%</p>
                </div>
                <div>
                  <p className="text-gray-500">DOM</p>
                  <p className="font-medium">{listing.daysOnMarket}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-2 text-sm bg-blue-50 p-2 rounded">
                <div>
                  <p className="text-gray-500">Est. ARV</p>
                  <p className="font-medium">${listing.estimatedArv.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Repairs</p>
                  <p className="font-medium">${listing.estimatedRepairs.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Profit</p>
                  <p className={`font-medium ${listing.deal.estimatedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${listing.deal.estimatedProfit?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-400">Agent: {listing.agentName} • {listing.agentPhone}</p>
                <button
                  onClick={() => importToList(listing)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add to Sourcing
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">🏠</p>
          <p>No expired listings found</p>
          <p className="text-sm mt-2">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}