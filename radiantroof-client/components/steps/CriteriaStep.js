import React, { useState, useEffect } from "react";

export default function CriteriaStep({ propertyId, updateMetrics }) {
  const [criteria, setCriteria] = useState({
    minROI: 15,
    maxBudget: 250000,
    minBedrooms: 2,
    preferredAreas: "",
  });

  useEffect(() => {
    // Update sidebar with criteria if needed
    if (updateMetrics) {
      // Criteria doesn't directly update metrics, but we could
      // use this to filter opportunities later
    }
  }, [criteria, updateMetrics]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saving criteria for property", propertyId, criteria);
    // API call would go here
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Investment Criteria</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Minimum ROI (%)</label>
          <input
            type="number"
            name="minROI"
            value={criteria.minROI}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            max="100"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Maximum Budget ($)</label>
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
          <label className="block mb-1 font-medium">Minimum Bedrooms</label>
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
          <label className="block mb-1 font-medium">Preferred Areas</label>
          <input
            type="text"
            name="preferredAreas"
            value={criteria.preferredAreas}
            onChange={handleChange}
            placeholder="e.g., Downtown, Suburbs"
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Save Criteria
        </button>
      </form>
    </div>
  );
}
