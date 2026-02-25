import React from "react";

export default function InvestorDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Investor Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Portfolio Value</h3>
          <p className="text-2xl text-green-600">⏳ Pending</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">Active Investments</h3>
          <p className="text-2xl text-blue-600">⏳ Pending</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-bold">ROI</h3>
          <p className="text-2xl text-purple-600">⏳ Pending</p>
        </div>
      </div>
    </div>
  );
}