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
    setPropertyData({ ...propertyData, [name]: name === 'notes' ? value : Number(value) });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPropertyData({ ...propertyData, [name]: value });
  };

  const handleSave = async () => {
    try {
      await updateProperty(propertyId, { screening: propertyData });
      alert("Screening data saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Property Screening</h3>
      
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
            className="border
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
        <p>Cash-on-Cash: {propertyData.askingPrice > 0 
          ? Math.round(((propertyData.arv - propertyData.repairs - propertyData.askingPrice) / propertyData.askingPrice) * 100) 
          : 0}%</p>
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