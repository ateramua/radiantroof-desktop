"use client";
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CountyRecords({ onNewDeal }) {
  const { user } = useAuth();
  const [selectedCounty, setSelectedCounty] = useState('travis-tx');
  const [recordType, setRecordType] = useState('delinquent');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Available counties
  const counties = [
    { id: 'travis-tx', name: 'Travis County, TX', enabled: true },
    { id: 'dallas-tx', name: 'Dallas County, TX', enabled: true }
  ];

  const fetchCountyRecords = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Call your backend API
      const response = await fetch(`http://localhost:5001/api/county/fetch/${selectedCounty}?type=${recordType}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Enhance properties with deal scoring
        const enhanced = data.properties.map(property => {
          // Simple scoring for demo
          const estimatedProfit = (property.marketValue || property.assessedValue * 1.1) - 
                                 (property.assessedValue * 0.9) - 
                                 (property.sqft ? property.sqft * 30 : 30000) - 
                                 26900;
          
          const score = estimatedProfit > 50000 ? 85 : 
                       estimatedProfit > 25000 ? 65 : 40;
          
          const priority = score >= 75 ? 'hot' : 
                          score >= 50 ? 'warm' : 'cold';
          
          return {
            ...property,
            deal: {
              estimatedArv: property.marketValue || property.assessedValue * 1.1,
              estimatedRepairs: property.sqft ? property.sqft * 30 : 30000,
              estimatedProfit: Math.round(estimatedProfit),
              score,
              priority
            }
          };
        });
        
        setProperties(enhanced);
      } else {
        setError(data.error || 'Failed to fetch county data');
      }
    } catch (err) {
      console.error('Error fetching county records:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const importProperty = (property) => {
    // Create a deal object to pass up
    const deal = {
      id: `county-${Date.now()}-${Math.random()}`,
      address: property.address,
      city: property.city,
      state: property.state,
      zip: property.zip,
      askingPrice: property.assessedValue * 0.9,
      estimatedArv: property.deal.estimatedArv,
      estimatedRepairs: property.deal.estimatedRepairs,
      estimatedProfit: property.deal.estimatedProfit,
      score: property.deal.score,
      priority: property.deal.priority,
      sourceType: 'county',
      sourceDetail: `${counties.find(c => c.id === selectedCounty)?.name} - ${recordType}`,
      ownerName: property.ownerName,
      parcelId: property.parcelId
    };
    
    if (onNewDeal) {
      onNewDeal(deal);
      alert(`✅ Added ${property.address} to sourcing list!`);
    }
  };

  const importAll = () => {
    if (onNewDeal) {
      properties.forEach(p => importProperty(p));
      alert(`✅ Added ${properties.length} properties to sourcing list!`);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'delinquent': return '⚠️';
      case 'probate': return '⚖️';
      case 'absentee': return '🏝️';
      default: return '🏠';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'delinquent': return 'Tax Delinquent';
      case 'probate': return 'Probate';
      case 'absentee': return 'Absentee Owner';
      default: return type;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="mr-2">🏛️</span>
          County Records
        </h3>
        <div className="flex space-x-2">
          {properties.length > 0 && (
            <button
              onClick={importAll}
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Import All ({properties.length})
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <label className="block text-xs text-gray-500 mb-1">County</label>
          <select
            value={selectedCounty}
            onChange={(e) => setSelectedCounty(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            {counties.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-xs text-gray-500 mb-1">Record Type</label>
          <select
            value={recordType}
            onChange={(e) => setRecordType(e.target.value)}
            className="w-full border rounded px-2 py-1 text-sm"
          >
            <option value="delinquent">⚠️ Tax Delinquent</option>
            <option value="probate">⚖️ Probate</option>
            <option value="absentee">🏝️ Absentee Owner</option>
          </select>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={fetchCountyRecords}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded text-sm">
          ❌ {error}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-500">Searching county records...</p>
        </div>
      ) : properties.length > 0 ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {properties.map((property, idx) => (
            <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{getTypeIcon(recordType)}</span>
                    <h4 className="font-semibold">{property.address}</h4>
                  </div>
                  <p className="text-sm text-gray-500">
                    {property.city}, {property.state} {property.zip}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  property.deal.priority === 'hot' ? 'bg-red-100 text-red-800' :
                  property.deal.priority === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {property.deal.priority?.toUpperCase()} • Score: {property.deal.score}
                </span>
              </div>

              {/* Owner Info */}
              <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                <p className="font-medium">{property.ownerName}</p>
                <p className="text-xs text-gray-500">{property.ownerAddress}</p>
              </div>

              {/* County Data */}
              <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                <div>
                  <p className="text-gray-500">Assessed</p>
                  <p className="font-medium">${property.assessedValue?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Market</p>
                  <p className="font-medium">${property.marketValue?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Tax</p>
                  <p className="font-medium">${property.taxAmount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Year</p>
                  <p className="font-medium">{property.yearBuilt || '—'}</p>
                </div>
              </div>

              {/* Deal Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm bg-blue-50 p-2 rounded">
                <div>
                  <p className="text-gray-500">Est. ARV</p>
                  <p className="font-medium">${Math.round(property.deal.estimatedArv).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Repairs</p>
                  <p className="font-medium">${property.deal.estimatedRepairs.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Est. Profit</p>
                  <p className={`font-medium ${property.deal.estimatedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${property.deal.estimatedProfit.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end mt-3">
                <button
                  onClick={() => importProperty(property)}
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Import Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 border rounded">
          <p className="text-4xl mb-2">🏛️</p>
          <p>Select a county and record type to search</p>
          <p className="text-sm mt-2">Tax delinquent, probate, and absentee owner records are free!</p>
        </div>
      )}
    </div>
  );
}