import React, { useState, useEffect } from "react";
import { updateProperty } from "../../lib/api";

export default function AnalysisStep({ propertyId, updateMetrics }) {
  const [holdingCosts, setHoldingCosts] = useState({
    taxes: 500,
    insurance: 1200,
    utilities: 300,
    interest: 2000,
    months: 6
  });
  
  const [dealScore, setDealScore] = useState(8.7);

  useEffect(() => {
    // Calculate deal score based on holding costs
    const totalCosts = holdingCosts.taxes + holdingCosts.insurance + holdingCosts.utilities + holdingCosts.interest;
    const score = Math.max(0, Math.min(10, 10 - (totalCosts / 5000)));
    const roundedScore = Number(score.toFixed(1));
    setDealScore(roundedScore);
    
    // Update sidebar
    if (updateMetrics) {
      updateMetrics({ dealScore: roundedScore });
    }
  }, [holdingCosts, updateMetrics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHoldingCosts({ ...holdingCosts, [name]: Number(value) });
  };

  const handleSave = async () => {
    try {
      const analysisData = {
        holdingCosts,
        dealScore,
        totalHoldingCost: Object.values(holdingCosts).reduce((a, b) => a + b, 0)
      };
      await updateProperty(propertyId, { analysis: analysisData });
      alert("Analysis data saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Financial Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(holdingCosts).map((field) => (
          <div key={field}>
            <label className="block mb-1 font-medium capitalize">{field}</label>
            <input
              type="number"
              name={field}
              value={holdingCosts[field]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              min="0"
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h4 className="font-semibold mb-2">Summary</h4>
        <p>Total Holding Costs: ${Object.values(holdingCosts).reduce((a, b) => a + b, 0).toLocaleString()}</p>
        <p>Deal Score: {dealScore} / 10</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${dealScore * 10}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Save Analysis
      </button>
    </div>
  );
}