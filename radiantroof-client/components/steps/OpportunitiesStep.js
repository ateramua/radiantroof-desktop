import React, { useState, useEffect } from "react";

export default function OpportunitiesStep({ propertyId }) {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch - in real app, this would call the backend
    setTimeout(() => {
      setOpportunities([
        { id: 1, name: "Fixer-upper special", roi: 18, price: 180000, address: "123 Main St" },
        { id: 2, name: "Distressed sale", roi: 22, price: 155000, address: "456 Oak Ave" },
        { id: 3, name: "Foreclosure opportunity", roi: 15, price: 210000, address: "789 Pine Rd" },
      ]);
      setLoading(false);
    }, 1000);
  }, [propertyId]);

  if (loading) return <div className="bg-white p-6 rounded shadow">Loading opportunities...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Matching Opportunities</h3>
      <div className="space-y-3">
        {opportunities.map((opp) => (
          <div key={opp.id} className="border p-4 rounded hover:shadow transition">
            <h4 className="font-bold">{opp.name}</h4>
            <p className="text-gray-600">{opp.address}</p>
            <p>Price: ${opp.price.toLocaleString()}</p>
            <p className="text-green-600 font-medium">Projected ROI: {opp.roi}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}