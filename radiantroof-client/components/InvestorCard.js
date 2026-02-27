import React from "react";

export default function InvestorCard({ investor }) {
  // To be implemented with actual data
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-bold">{investor?.name || "⏳ Investor Name"}</h3>
      <p className="text-gray-500">⏳ Pending implementation</p>
    </div>
  );
}