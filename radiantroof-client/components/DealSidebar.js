import React from "react";
import Link from "next/link";

export default function DealSidebar({ step, data }) {
  return (
    <div className="bg-gray-50 p-4 rounded shadow space-y-4 sticky top-4">
      <h3 className="font-bold text-lg">{data.propertyName || "Property Details"}</h3>

      {/* // Add to existing DashboardSidebar navigation */}
<nav className="mt-5 px-2">
  {/* Existing navigation */}
  <Link href="/investors/portfolio" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
    📊 Portfolio Overview
  </Link>
  
  {/* NEW: Deal Flow Navigation */}
  <div className="mt-4">
    <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
      Deal Engine
    </h3>
    <div className="mt-1 space-y-1">
      <Link href="/investors/portfolio" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-50">
        🎯 New Deal Analysis
      </Link>
      <Link href="/investors/portfolio/deals" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
        📁 Saved Deals
      </Link>
      <Link href="/investors/portfolio/reports" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50">
        📈 Reports
      </Link>
    </div>
  </div>
  
  {/* Existing transaction link */}
  <Link href="/investors/transactions" className="group flex items-center px-2 py-2 text-sm font-medium rounded-md">
    💰 Transactions
  </Link>
</nav>
      {step >= 2 && ( // Screening Step & beyond
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Property Snapshot</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>ARV Estimate: {data.arv ? `$${data.arv.toLocaleString()}` : "-"}</li>
            <li>Estimated Repairs: {data.repairs ? `$${data.repairs.toLocaleString()}` : "-"}</li>
            <li>Asking Price: {data.askingPrice ? `$${data.askingPrice.toLocaleString()}` : "-"}</li>
            <li>
              MAO: {data.mao ? `$${data.mao.toLocaleString()}` : "-"}{" "}
              {data.mao && data.askingPrice && data.askingPrice <= data.mao ? (
                <span className="text-green-600 font-semibold">✓ Pass</span>
              ) : data.mao && data.askingPrice ? (
                <span className="text-red-600 font-semibold">✗ Over MAO</span>
              ) : null}
            </li>
          </ul>
        </div>
      )}

      {step >= 3 && ( // Analysis Step & beyond
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">ROI & Deal Metrics</h4>
          <ul className="text-gray-600 text-sm space-y-1">
            <li>Projected Net Profit: {data.projectedProfit ? `$${data.projectedProfit.toLocaleString()}` : "-"}</li>
            <li>Cash-on-Cash Return: {data.cashOnCash ? `${data.cashOnCash}%` : "-"}</li>
            <li>Deal Score: {data.dealScore || "-"} / 10</li>
          </ul>
        </div>
      )}

      {step >= 4 && ( // Decision Step & beyond
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Approval Status</h4>
          <p className="text-gray-600 text-sm">Pending Decision...</p>
        </div>
      )}

      {step >= 5 && ( // Acquisition Step
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Acquisition Status</h4>
          <p className="text-gray-600 text-sm">Offer in Progress</p>
        </div>
      )}
    </div>
  );
}