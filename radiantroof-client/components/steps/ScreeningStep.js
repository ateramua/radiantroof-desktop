import React, { useState, useEffect } from "react";
import { updateProperty } from "../../lib/api";

export default function ScreeningStep({ propertyId, updateMetrics }) {
  const [propertyData, setPropertyData] = useState({
    arv: 325000,
    repairs: 45000,
    askingPrice: 180000,
    condition: "Good",
    locationScore: 7,
    marketTrend: "Stable",
    notes: "",
  });

  // Helper functions for decision logic
  const calculateScore = (data) => {
    let score = 0;
    
    // Location score (0-30 points)
    score += (data.locationScore / 10) * 30;
    
    // Condition score (0-20 points)
    const conditionScores = { Excellent: 20, Good: 15, Fair: 8, Poor: 0 };
    score += conditionScores[data.condition] || 10;
    
    // Market trend (0-20 points)
    const marketScores = { Rising: 20, Stable: 10, Declining: 0 };
    score += marketScores[data.marketTrend] || 5;
    
    // Profit potential (0-30 points)
    const profit = data.arv - data.repairs - data.askingPrice;
    if (profit > 50000) score += 30;
    else if (profit > 30000) score += 20;
    else if (profit > 15000) score += 10;
    else if (profit > 0) score += 5;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const getRecommendation = (data, score) => {
    const profit = data.arv - data.repairs - data.askingPrice;
    
    if (score >= 70 && profit > 30000) {
      return "STRONG CANDIDATE - Proceed to analysis";
    } else if (score >= 50 && profit > 15000) {
      return "POTENTIAL DEAL - Investigate further";
    } else if (profit <= 0) {
      return "PASS - Negative profit projection";
    } else if (data.locationScore < 5) {
      return "PASS - Poor location score";
    } else {
      return "MAYBE - Needs more research";
    }
  };

  const getRejectionReasons = (data) => {
    const reasons = [];
    const profit = data.arv - data.repairs - data.askingPrice;
    
    if (profit <= 0) reasons.push("No profit potential");
    if (data.locationScore < 5) reasons.push("Poor location");
    if (data.condition === "Poor") reasons.push("Major repairs needed");
    if (data.marketTrend === "Declining") reasons.push("Declining market");
    
    return reasons;
  };

  const getDealBreakers = (data) => {
    const breakers = [];
    
    if (data.arv - data.repairs - data.askingPrice < -10000) {
      breakers.push("Price exceeds ARV by $10k+ after repairs");
    }
    if (data.locationScore < 3) breakers.push("Undesirable location");
    if (data.condition === "Poor" && data.repairs > 100000) {
      breakers.push("Major structural issues likely");
    }
    
    return breakers;
  };

  useEffect(() => {
    // Calculate derived metrics
    const mao = propertyData.arv - propertyData.repairs - 15000; // Example MAO formula
    const projectedProfit = propertyData.arv - propertyData.repairs - propertyData.askingPrice;
    const cashOnCash = propertyData.askingPrice > 0
      ? Math.round((projectedProfit / propertyData.askingPrice) * 100)
      : 0;

    // Update sidebar via parent
    if (updateMetrics) {
      updateMetrics({
        arv: propertyData.arv,
        repairs: propertyData.repairs,
        askingPrice: propertyData.askingPrice,
        mao,
        projectedProfit,
        cashOnCash,
      });
    }
  }, [propertyData, updateMetrics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: name === "notes" ? value : Number(value) });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const score = calculateScore(propertyData);
      const rejectionReasons = getRejectionReasons(propertyData);
      const dealBreakers = getDealBreakers(propertyData);
      const recommendation = getRecommendation(propertyData, score);
      
      // Determine status based on score
      let status = "REVIEW";
      if (score >= 70) status = "INVESTIGATE";
      else if (score < 50 || rejectionReasons.length > 0) status = "PASS";
      else if (dealBreakers.length > 0) status = "FLAG";
      
      // Structured decision data - this matches the JSON format you wanted
      const screeningData = {
        status: status,
        rejectionReasons: rejectionReasons,
        dealBreakers: dealBreakers,
        score: score,
        recommendation: recommendation,
        nextStep: score >= 70 ? "ANALYSIS" : null,
        // Also include the raw data for reference
        metrics: {
          arv: propertyData.arv,
          repairs: propertyData.repairs,
          askingPrice: propertyData.askingPrice,
          condition: propertyData.condition,
          locationScore: propertyData.locationScore,
          marketTrend: propertyData.marketTrend,
          projectedProfit: propertyData.arv - propertyData.repairs - propertyData.askingPrice
        },
        notes: propertyData.notes
      };

      await updateProperty(propertyId, { screening: screeningData });
      
      // Show different messages based on decision
      if (status === "PASS") {
        alert(`⛔ PASS: ${recommendation}`);
      } else if (status === "INVESTIGATE") {
        alert(`✅ ${recommendation}`);
      } else {
        alert(`Screening saved! Score: ${score}/100`);
      }
      
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  // Calculate live score for display
  const currentScore = calculateScore(propertyData);
  const currentRecommendation = getRecommendation(propertyData, currentScore);
  
  // Determine score color
  const getScoreColor = () => {
    if (currentScore >= 70) return "text-green-600";
    if (currentScore >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Property Screening</h3>
      
      {/* Live Decision Dashboard */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold">Deal Score:</span>
          <span className={`text-2xl font-bold ${getScoreColor()}`}>
            {currentScore}/100
          </span>
        </div>
        <div className="text-sm text-gray-600 mb-2">
          Recommendation: <span className="font-medium">{currentRecommendation}</span>
        </div>
        {currentScore < 50 && (
          <div className="text-xs text-red-600 mt-1">
            ⚠️ This property is not meeting minimum criteria
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">ARV ($)</label>
          <input
            type="number"
            name="arv"
            value={propertyData.arv}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Repairs ($)</label>
          <input
            type="number"
            name="repairs"
            value={propertyData.repairs}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Asking Price ($)</label>
          <input
            type="number"
            name="askingPrice"
            value={propertyData.askingPrice}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Condition</label>
          <select
            name="condition"
            value={propertyData.condition}
            onChange={handleSelectChange}
            className="border p-2 rounded w-full"
          >
            <option>Excellent</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Location Score (1-10)</label>
          <input
            type="number"
            name="locationScore"
            min="1"
            max="10"
            value={propertyData.locationScore}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Market Trend</label>
          <select
            name="marketTrend"
            value={propertyData.marketTrend}
            onChange={handleSelectChange}
            className="border p-2 rounded w-full"
          >
            <option>Rising</option>
            <option>Stable</option>
            <option>Declining</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <textarea
          name="notes"
          value={propertyData.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Calculated Metrics</h4>
        <p>MAO: ${(propertyData.arv - propertyData.repairs - 15000).toLocaleString()}</p>
        <p>Projected Profit: ${(propertyData.arv - propertyData.repairs - propertyData.askingPrice).toLocaleString()}</p>
        <p>
          Cash-on-Cash:{" "}
          {propertyData.askingPrice > 0
            ? Math.round(((propertyData.arv - propertyData.repairs - propertyData.askingPrice) / propertyData.askingPrice) * 100)
            : 0}
          %
        </p>
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Save Screening
      </button>
    </div>
  );
}