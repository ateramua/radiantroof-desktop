"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function ScreeningPage() {
  const { user } = useAuth();
  const [activeProperty, setActiveProperty] = useState("123 Main St");
  const [arv, setArv] = useState(425000);
  const [repairCost, setRepairCost] = useState(45000);
  const [askingPrice, setAskingPrice] = useState(325000);

  // Sample properties
  const properties = [
    { id: 1, address: "123 Main St", score: 82, status: "PASS" },
    { id: 2, address: "456 Oak Ave", score: 45, status: "FAIL" },
    { id: 3, address: "789 Pine St", score: 92, status: "HOT" },
  ];

  // Calculate 70% rule
  const maxOffer = arv * 0.7 - repairCost;
  const isPassing = maxOffer >= askingPrice;
  const difference = askingPrice - maxOffer;

  // Checklist items
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Collect Property Info", completed: true, subtasks: ["Photos uploaded", "Sq Ft confirmed", "Year Built verified"] },
    { id: 2, task: "ARV Estimate", completed: true, subtasks: ["6 comps found"] },
    { id: 3, task: "Repair Cost Estimate", completed: false, subtasks: ["Quick estimate: $45,000"] },
    { id: 4, task: "Market Health Check", completed: true, subtasks: ["Job Growth: +3.2%", "School Rating: 7/10", "Crime Trend: ↓5%"] },
    { id: 5, task: "70% Rule", completed: false, subtasks: [] },
  ]);

  const toggleTask = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Property Screening</h1>
          <p className="text-sm text-gray-500 mt-1">
            Due diligence checklist and deal analysis
          </p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            {properties.map(p => (
              <option key={p.id}>{p.address}</option>
            ))}
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Move to Analysis
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Checklist (2/3 width) */}
        <div className="col-span-2 space-y-6">
          {/* Property Header */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{activeProperty}</h2>
                <p className="text-sm text-gray-500">Property #342</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Quick Score</p>
                <p className="text-3xl font-bold text-blue-600">82/100</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                  PASS
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Deal Floss Checklist</h3>
            
            <div className="space-y-4">
              {checklist.map((item) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTask(item.id)}
                      className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        item.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {item.completed && '✓'}
                    </button>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.task}</h4>
                      {item.subtasks.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.subtasks.map((subtask, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                              <span className="mr-2">└──</span>
                              {subtask}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - 70% Rule Calculator (1/3 width) */}
        <div className="space-y-6">
          {/* 70% Rule Calculator */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">70% Rule Calculator</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">ARV (After Repair Value)</label>
                <input
                  type="range"
                  min="300000"
                  max="550000"
                  step="5000"
                  value={arv}
                  onChange={(e) => setArv(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-400">$300k</span>
                  <span className="font-medium">${arv.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">$550k</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Repair Costs</label>
                <input
                  type="range"
                  min="20000"
                  max="100000"
                  step="1000"
                  value={repairCost}
                  onChange={(e) => setRepairCost(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-400">$20k</span>
                  <span className="font-medium">${repairCost.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">$100k</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Maximum Safe Offer (70% Rule)</p>
                  <p className="text-2xl font-bold text-blue-600">${maxOffer.toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    ARV × 0.7 - Repairs
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Asking Price</label>
                <input
                  type="number"
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Result */}
              <div className={`p-4 rounded-lg ${
                isPassing ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className="text-sm font-medium mb-1">
                  {isPassing ? '✅ PASSES 70% Rule' : '❌ FAILS 70% Rule'}
                </p>
                {!isPassing && (
                  <p className="text-sm">
                    Asking price is <span className="font-bold text-red-600">${Math.abs(difference).toLocaleString()}</span> over max safe offer
                  </p>
                )}
                {isPassing && (
                  <p className="text-sm">
                    You have <span className="font-bold text-green-600">${difference.toLocaleString()}</span> of room
                  </p>
                )}
              </div>

              {/* Negotiation Tip */}
              {!isPassing && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-xs text-yellow-800 font-semibold mb-1">💡 NEGOTIATION TIP</p>
                  <p className="text-sm">
                    Offer ${(maxOffer + 10000).toLocaleString()}, walk at ${(maxOffer + 25000).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Screening Decision */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Screening Decision</h3>
            <div className="flex space-x-2">
              <button className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg hover:bg-red-200 transition">
                ❌ Discard
              </button>
              <button className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded-lg hover:bg-yellow-200 transition">
                ⏳ Hold
              </button>
              <button className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition">
                ✅ Proceed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}