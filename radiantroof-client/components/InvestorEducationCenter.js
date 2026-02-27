"use client";

import { useState } from "react";
import Link from "next/link";

export default function InvestorEducationCenter() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const inputFields = {
    criteria: [
      { field: "Min ROI (%)", example: "15%", why: "Your minimum acceptable return" },
      { field: "Max Budget ($)", example: "$250,000", why: "Price ceiling for your search" },
      { field: "Min Cash-on-Cash (%)", example: "8%", why: "Minimum annual cash return" },
      { field: "Min Cap Rate (%)", example: "6%", why: "Minimum property yield" },
      { field: "Min Bedrooms", example: "2", why: "Property size requirement" },
      { field: "Preferred Areas", example: "Downtown, Northside", why: "Your target neighborhoods" },
      { field: "Investment Strategy", example: "Buy and Hold", why: "Your overall approach" },
    ],
    screening: [
      { field: "ARV (After Repair Value)", example: "$425,000", why: "What property will be worth after repairs" },
      { field: "Repair Costs ($)", example: "$45,000", why: "Estimated cost of renovations" },
      { field: "Asking Price ($)", example: "$325,000", why: "What the seller wants" },
      { field: "Condition", example: "Good", why: "Your assessment of property state" },
      { field: "Location Score (1-10)", example: "7", why: "Your rating of the neighborhood" },
      { field: "Market Trend", example: "Rising", why: "Local market direction" },
    ],
    analysis: [
      { field: "Monthly Rent ($)", example: "$2,800", why: "Projected rental income" },
      { field: "Property Taxes (annual)", example: "$4,200", why: "Annual tax obligation" },
      { field: "Insurance (annual)", example: "$1,800", why: "Annual insurance cost" },
      { field: "Property Management ($/mo)", example: "$280", why: "Cost of professional management" },
      { field: "Vacancy Rate (%)", example: "5%", why: "Expected time without tenant" },
      { field: "Interest Rate (%)", example: "6.25%", why: "Your loan interest rate" },
      { field: "Down Payment (%)", example: "20%", why: "Your upfront cash investment" },
    ],
    decision: [
      { field: "Offer Amount ($)", example: "$335,000", why: "What you're offering" },
      { field: "Earnest Money ($)", example: "$5,000", why: "Good faith deposit" },
      { field: "Contingencies", example: "Inspection, Financing", why: "Conditions for the offer" },
      { field: "Negotiation Rounds", example: "Round 1: $330k → $340k", why: "Each back-and-forth" },
      { field: "Final Outcome", example: "ACCEPTED", why: "How it ended" },
    ],
    acquisition: [
      { field: "Final Price ($)", example: "$335,000", why: "What you actually paid" },
      { field: "Closing Date", example: "2026-03-15", why: "When you took ownership" },
      { field: "Closing Costs ($)", example: "$8,700", why: "Additional purchase costs" },
      { field: "Lender", example: "First National Bank", why: "Who financed the deal" },
      { field: "Interest Rate (%)", example: "6.25%", why: "Your actual rate" },
      { field: "Lesson Learned", example: "Should have offered lower", why: "Your key insight" },
    ],
  };

  const calculatedFields = {
    criteria: [
      { field: "Match Score (0-100)", how: "How well property fits your criteria" },
      { field: "Status", how: "PASS/REVIEW/FAIL based on criteria" },
    ],
    screening: [
      { field: "Projected Profit", formula: "ARV - (Asking Price + Repairs)", example: "$55,000" },
      { field: "Maximum Allowable Offer (MAO)", formula: "ARV - Repairs - Desired Profit", example: "$340,000" },
      { field: "Deal Score (0-100)", how: "Weighted formula based on inputs", example: "85/100" },
      { field: "Recommendation", how: "Based on score", example: "Strong candidate" },
    ],
    analysis: [
      { field: "Monthly Cash Flow", formula: "Rent - Expenses", example: "$520" },
      { field: "Cash-on-Cash Return", formula: "Annual Cash Flow / Down Payment", example: "12.5%" },
      { field: "Cap Rate", formula: "NOI / Purchase Price", example: "8.2%" },
      { field: "ROI", formula: "(Cash Flow + Appreciation) / Investment", example: "18.7%" },
      { field: "Deal Score (0-100)", how: "Weighted formula", example: "92/100" },
      { field: "Verdict", how: "Based on score", example: "STRONG BUY" },
    ],
    decision: [
      { field: "Days in Negotiation", how: "Tracks negotiation duration" },
      { field: "Total Offers Made", how: "Count of all offers" },
      { field: "Timeline Events", how: "Auto-records major milestones" },
    ],
    acquisition: [
      { field: "Variance (%)", formula: "(Actual - Projected) / Projected × 100", example: "-4.9%" },
      { field: "Variance Warning", how: "🔴 if >10%, 🟢 if <10%" },
      { field: "Acquisition Status", how: "ACQUIRED or PENDING" },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Investor Education Center
        </h2>
        <p className="text-indigo-100 text-sm mt-1">
          Your complete guide to making data-driven investment decisions
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            📊 Overview
          </button>
          <button
            onClick={() => setActiveTab("inputs")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "inputs"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🔵 What You Input
          </button>
          <button
            onClick={() => setActiveTab("calculated")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "calculated"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            🟢 What We Calculate
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "checklist"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            ✅ Checklist
          </button>
        </nav>
      </div>

      {/* Content Area */}
      <div className="p-6 max-h-[500px] overflow-y-auto">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">🎯 Welcome to Your Investment Decision System</h3>
              <p className="text-sm text-blue-700">
                This guide walks you through each step of evaluating properties - from setting criteria to 
                closing the deal. Think of it as your digital investment companion that captures your thinking 
                and helps you make better decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { step: "Criteria", emoji: "📋", time: "5 min setup", desc: "Define what you're looking for" },
                { step: "Screening", emoji: "🔍", time: "2-3 min/property", desc: "Quick pass/fail assessment" },
                { step: "Analysis", emoji: "📊", time: "5-10 min/property", desc: "Deep dive into numbers" },
                { step: "Decision", emoji: "🤝", time: "2-5 min/round", desc: "Make offers & track negotiations" },
                { step: "Acquisition", emoji: "📝", time: "3-5 min", desc: "Close the deal and learn" },
              ].map((item) => (
                <div key={item.step} className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.emoji}</span>
                    <h4 className="font-semibold">{item.step}</h4>
                    <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inputs Tab */}
        {activeTab === "inputs" && (
          <div className="space-y-3">
            {["criteria", "screening", "analysis", "decision", "acquisition"].map((step) => (
              <div key={step} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(step)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="font-semibold capitalize">{step} Step</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedSection === step ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSection === step && (
                  <div className="p-4 border-t">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500">
                          <th className="pb-2">Field</th>
                          <th className="pb-2">Example</th>
                          <th className="pb-2">Why It Matters</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inputFields[step].map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-2 font-medium">{item.field}</td>
                            <td className="py-2 text-blue-600">{item.example}</td>
                            <td className="py-2 text-xs text-gray-600">{item.why}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Calculated Tab */}
        {activeTab === "calculated" && (
          <div className="space-y-3">
            {["screening", "analysis", "decision", "acquisition"].map((step) => (
              <div key={step} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(`calc-${step}`)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="font-semibold capitalize">{step} Step - What We Calculate</span>
                  <svg
                    className={`w-5 h-5 transform transition-transform ${expandedSection === `calc-${step}` ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {expandedSection === `calc-${step}` && (
                  <div className="p-4 border-t">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500">
                          <th className="pb-2">Calculated Field</th>
                          <th className="pb-2">How It's Calculated</th>
                          <th className="pb-2">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculatedFields[step].map((item, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="py-2 font-medium">{item.field}</td>
                            <td className="py-2 text-xs text-gray-600">{item.formula || item.how}</td>
                            <td className="py-2 text-green-600">{item.example || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Checklist Tab */}
        {activeTab === "checklist" && (
          <div className="space-y-4">
            {[
              { step: "Criteria", items: ["Min ROI set realistically", "Max budget defined", "Preferred areas listed"] },
              { step: "Screening", items: ["ARV estimated using comps", "Repair costs calculated", "Location score honest"] },
              { step: "Analysis", items: ["Monthly rent researched", "Taxes confirmed with county", "Insurance quotes obtained"] },
              { step: "Decision", items: ["Offer amount within MAO", "Contingencies added", "Final outcome recorded"] },
              { step: "Acquisition", items: ["Final price entered", "Closing date recorded", "Lesson learned captured"] },
            ].map((section) => (
              <div key={section.step} className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">📋 {section.step} Checklist</h4>
                <div className="space-y-2">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="rounded text-indigo-600" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t px-6 py-3 bg-gray-50 text-xs text-gray-500 flex justify-between">
        <span>💡 Click on any section to expand details</span>
        <Link href="/properties" className="text-indigo-600 hover:text-indigo-800">
          Go to Properties →
        </Link>
      </div>
    </div>
  );
}