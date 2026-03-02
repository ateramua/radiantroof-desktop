import React, { useState, useEffect } from "react";
import { updateProperty } from "../../lib/api";

export default function CriteriaStep({ propertyId, updateMetrics }) {
  const [criteria, setCriteria] = useState({
    // Financial Criteria
    minROI: 15,
    maxBudget: 250000,
    minCashOnCash: 8,
    minCapRate: 6,
    maxPricePerSqft: 200,
    
    // Property Criteria
    minBedrooms: 2,
    minBathrooms: 1,
    minSquareFeet: 1000,
    propertyTypes: ["Single Family", "Condo", "Multi-Family"],
    minYearBuilt: 1980,
    
    // Location Criteria
    preferredAreas: "",
    excludedAreas: "",
    schoolRating: 6, // 1-10
    walkabilityScore: 5, // 1-10
    proximityToTransit: 3, // miles
    floodZone: false,
    
    // Market Criteria
    marketTrend: "Any", // Rising, Stable, Declining, Any
    minAppreciationRate: 3, // %
    maxDaysOnMarket: 60,
    
    // Investment Strategy
    investmentStrategy: "Buy and Hold", // Fix and Flip, Buy and Hold, BRRRR
    desiredProfit: 30000,
    exitStrategy: "Rent", // Rent, Sell, Refinance
    holdPeriod: 5, // years
    leverageTarget: 80, // % LTV
  });

  const [matchingScore, setMatchingScore] = useState(0);
  const [complianceStatus, setComplianceStatus] = useState({
    meetsBudget: true,
    meetsROI: true,
    meetsLocation: true,
    meetsPropertyType: true,
    overall: "PENDING"
  });

  // Calculate how well a property matches criteria
  // This would ideally compare with actual property data
  useEffect(() => {
    calculateMatchingScore();
  }, [criteria]);

  const calculateMatchingScore = () => {
    // This is a placeholder - in reality, you'd compare with actual property data
    // For now, we'll generate a random score to demonstrate the UI
    const mockPropertyData = {
      price: 225000,
      estimatedROI: 16.5,
      cashOnCash: 9.2,
      capRate: 7.8,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 1500,
      propertyType: "Single Family",
      yearBuilt: 1995,
      area: "Downtown",
      schoolRating: 8,
      walkability: 7
    };

    let score = 0;
    const status = {
      meetsBudget: mockPropertyData.price <= criteria.maxBudget,
      meetsROI: mockPropertyData.estimatedROI >= criteria.minROI,
      meetsLocation: true, // Would check preferred areas
      meetsPropertyType: criteria.propertyTypes.includes(mockPropertyData.propertyType)
    };

    // Calculate score based on criteria matching
    if (status.meetsBudget) score += 25;
    if (status.meetsROI) score += 25;
    if (status.meetsLocation) score += 25;
    if (status.meetsPropertyType) score += 25;

    // Bonus points for exceeding criteria
    if (mockPropertyData.estimatedROI > criteria.minROI * 1.5) score += 10;
    if (mockPropertyData.price < criteria.maxBudget * 0.8) score += 10;

    setMatchingScore(Math.min(100, score));
    setComplianceStatus({
      ...status,
      overall: score >= 70 ? "PASS" : score >= 50 ? "REVIEW" : "FAIL"
    });

    // Update sidebar with criteria summary
    if (updateMetrics) {
      updateMetrics({
        investmentStrategy: criteria.investmentStrategy,
        desiredProfit: criteria.desiredProfit,
        matchingScore: Math.min(100, score)
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setCriteria(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'propertyTypes') {
      // Handle multi-select
      const options = e.target.options;
      const selected = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(options[i].value);
        }
      }
      setCriteria(prev => ({ ...prev, [name]: selected }));
    } else {
      setCriteria(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Structured criteria data matching the investment decision format
      const criteriaData = {
        // Investment Parameters
        investmentStrategy: criteria.investmentStrategy,
        exitStrategy: criteria.exitStrategy,
        holdPeriod: criteria.holdPeriod,
        leverageTarget: criteria.leverageTarget,
        desiredProfit: criteria.desiredProfit,
        
        // Financial Filters
        financial: {
          minROI: criteria.minROI,
          maxBudget: criteria.maxBudget,
          minCashOnCash: criteria.minCashOnCash,
          minCapRate: criteria.minCapRate,
          maxPricePerSqft: criteria.maxPricePerSqft,
          minAppreciationRate: criteria.minAppreciationRate
        },
        
        // Property Specifications
        property: {
          minBedrooms: criteria.minBedrooms,
          minBathrooms: criteria.minBathrooms,
          minSquareFeet: criteria.minSquareFeet,
          propertyTypes: criteria.propertyTypes,
          minYearBuilt: criteria.minYearBuilt,
          maxDaysOnMarket: criteria.maxDaysOnMarket
        },
        
        // Location Preferences
        location: {
          preferredAreas: criteria.preferredAreas.split(',').map(area => area.trim()),
          excludedAreas: criteria.excludedAreas.split(',').map(area => area.trim()),
          minSchoolRating: criteria.schoolRating,
          minWalkabilityScore: criteria.walkabilityScore,
          maxProximityToTransit: criteria.proximityToTransit,
          floodZoneAllowed: !criteria.floodZone
        },
        
        // Market Conditions
        market: {
          preferredTrend: criteria.marketTrend,
          minAppreciationRate: criteria.minAppreciationRate,
          maxDaysOnMarket: criteria.maxDaysOnMarket
        },
        
        // Matching Results
        matchingAnalysis: {
          score: matchingScore,
          status: complianceStatus.overall,
          meetsBudget: complianceStatus.meetsBudget,
          meetsROI: complianceStatus.meetsROI,
          meetsLocation: complianceStatus.meetsLocation,
          meetsPropertyType: complianceStatus.meetsPropertyType,
          timestamp: new Date().toISOString()
        }
      };

      await updateProperty(propertyId, { criteria: criteriaData });
      
      // Show appropriate message based on matching score
      if (matchingScore >= 70) {
        alert(`✅ Great news! This property scores ${matchingScore}% against your criteria. Strong potential!`);
      } else if (matchingScore >= 50) {
        alert(`⚠️ Property scores ${matchingScore}% against your criteria. Worth investigating further.`);
      } else {
        alert(`⛔ Property only scores ${matchingScore}% against your criteria. Consider passing.`);
      }
      
    } catch (error) {
      console.error("Failed to save criteria:", error);
      alert("Error saving criteria");
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    const colors = {
      PASS: "bg-green-100 text-green-800 border-green-200",
      REVIEW: "bg-yellow-100 text-yellow-800 border-yellow-200",
      FAIL: "bg-red-100 text-red-800 border-red-200",
      PENDING: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Investment Criteria</h3>

      {/* Criteria Matching Dashboard */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Property Match Score:</span>
          <span className="text-2xl font-bold text-blue-600">{matchingScore}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
          <div 
            className={`h-2.5 rounded-full ${
              matchingScore >= 70 ? 'bg-green-600' :
              matchingScore >= 50 ? 'bg-yellow-600' :
              'bg-red-600'
            }`}
            style={{ width: `${matchingScore}%` }}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${complianceStatus.meetsBudget ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Budget: {complianceStatus.meetsBudget ? '✓ Within' : '✗ Exceeds'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${complianceStatus.meetsROI ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>ROI Target: {complianceStatus.meetsROI ? '✓ Meets' : '✗ Below'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${complianceStatus.meetsLocation ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Location: {complianceStatus.meetsLocation ? '✓ Preferred' : '✗ Outside'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${complianceStatus.meetsPropertyType ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span>Property Type: {complianceStatus.meetsPropertyType ? '✓ Matches' : '✗ Mismatch'}</span>
          </div>
        </div>

        <div className={`mt-3 p-2 rounded text-center font-medium ${getStatusColor(complianceStatus.overall)}`}>
          Overall Status: {complianceStatus.overall}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Investment Strategy Section */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Investment Strategy
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Strategy</label>
              <select
                name="investmentStrategy"
                value={criteria.investmentStrategy}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Buy and Hold</option>
                <option>Fix and Flip</option>
                <option>BRRRR</option>
                <option>Wholesale</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Exit Strategy</label>
              <select
                name="exitStrategy"
                value={criteria.exitStrategy}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Rent</option>
                <option>Sell</option>
                <option>Refinance</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Hold Period (years)</label>
              <input
                type="number"
                name="holdPeriod"
                value={criteria.holdPeriod}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">LTV Target (%)</label>
              <input
                type="number"
                name="leverageTarget"
                value={criteria.leverageTarget}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Financial Criteria */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Financial Criteria
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Min ROI (%)</label>
              <input
                type="number"
                name="minROI"
                value={criteria.minROI}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Max Budget ($)</label>
              <input
                type="number"
                name="maxBudget"
                value={criteria.maxBudget}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Cash-on-Cash (%)</label>
              <input
                type="number"
                name="minCashOnCash"
                value={criteria.minCashOnCash}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Cap Rate (%)</label>
              <input
                type="number"
                name="minCapRate"
                value={criteria.minCapRate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Max Price/Sq Ft ($)</label>
              <input
                type="number"
                name="maxPricePerSqft"
                value={criteria.maxPricePerSqft}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Desired Profit ($)</label>
              <input
                type="number"
                name="desiredProfit"
                value={criteria.desiredProfit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Property Criteria */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Property Specifications
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Min Bedrooms</label>
              <input
                type="number"
                name="minBedrooms"
                value={criteria.minBedrooms}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Bathrooms</label>
              <input
                type="number"
                name="minBathrooms"
                value={criteria.minBathrooms}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
                step="0.5"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Sq Feet</label>
              <input
                type="number"
                name="minSquareFeet"
                value={criteria.minSquareFeet}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
            <div className="col-span-3">
              <label className="block mb-1 text-sm font-medium">Property Types</label>
              <select
                name="propertyTypes"
                multiple
                value={criteria.propertyTypes}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
                size="3"
              >
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Multi-Family">Multi-Family (2-4 units)</option>
                <option value="Commercial">Commercial</option>
                <option value="Land">Land</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Year Built</label>
              <input
                type="number"
                name="minYearBuilt"
                value={criteria.minYearBuilt}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1900"
                max="2024"
              />
            </div>
          </div>
        </div>

        {/* Location Criteria */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Location Preferences
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block mb-1 text-sm font-medium">Preferred Areas</label>
              <input
                type="text"
                name="preferredAreas"
                value={criteria.preferredAreas}
                onChange={handleChange}
                placeholder="Downtown, Suburbs, Northside (comma separated)"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-sm font-medium">Excluded Areas</label>
              <input
                type="text"
                name="excludedAreas"
                value={criteria.excludedAreas}
                onChange={handleChange}
                placeholder="Flood zones, High crime areas (comma separated)"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min School Rating (1-10)</label>
              <input
                type="number"
                name="schoolRating"
                value={criteria.schoolRating}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Walkability (1-10)</label>
              <input
                type="number"
                name="walkabilityScore"
                value={criteria.walkabilityScore}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Max Distance to Transit (mi)</label>
              <input
                type="number"
                name="proximityToTransit"
                value={criteria.proximityToTransit}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="floodZone"
                  checked={criteria.floodZone}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                <span className="text-sm">Allow properties in flood zones</span>
              </label>
            </div>
          </div>
        </div>

        {/* Market Criteria */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Market Conditions
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Market Trend</label>
              <select
                name="marketTrend"
                value={criteria.marketTrend}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option>Any</option>
                <option>Rising</option>
                <option>Stable</option>
                <option>Declining</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Min Appreciation (%)</label>
              <input
                type="number"
                name="minAppreciationRate"
                value={criteria.minAppreciationRate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Max Days on Market</label>
              <input
                type="number"
                name="maxDaysOnMarket"
                value={criteria.maxDaysOnMarket}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                min="0"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-medium"
        >
          Save Investment Criteria
        </button>
      </form>

      {/* Criteria Summary */}
      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">Your Investment Profile</h4>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p>🎯 Looking for {criteria.investmentStrategy.toLowerCase()} opportunities</p>
          <p>💰 Budget: ${criteria.maxBudget.toLocaleString()} | Min ROI: {criteria.minROI}%</p>
          <p>🏠 Property: {criteria.minBedrooms}+ bed, {criteria.minBathrooms}+ bath, {criteria.minSquareFeet}+ sq ft</p>
          <p>📍 Areas: {criteria.preferredAreas || 'Any'}</p>
        </div>
      </div>
    </div>
  );
}