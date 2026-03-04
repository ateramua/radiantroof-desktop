"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function ScreeningPage() {
  const { user } = useAuth();
  const [activeProperty, setActiveProperty] = useState("123 Main St");
  const [arv, setArv] = useState(425000);
  const [askingPrice, setAskingPrice] = useState(325000);
  
  // NEW: Detailed repair estimate state
  const [repairEstimate, setRepairEstimate] = useState({
    // Major systems
    majorSystems: {
      roof: { condition: "Fair", cost: 8000 },
      hvac: { condition: "Good", cost: 0 },
      electrical: { condition: "Poor", cost: 12000 },
      plumbing: { condition: "Good", cost: 0 },
      foundation: { condition: "Good", cost: 0 }
    },
    // Room-by-room
    rooms: {
      kitchen: { condition: "Full Gut", cost: 25000 },
      bathroom1: { condition: "Full Gut", cost: 12000 },
      bathroom2: { condition: "Cosmetic", cost: 5000 },
      bedrooms: { condition: "Paint/Flooring", cost: 8000 },
      living: { condition: "Paint/Flooring", cost: 4000 },
      basement: { condition: "Waterproofing", cost: 6000 }
    },
    contingencyPercent: 15,
    totalQuickEstimate: 0,
    finalRepairBudget: 0
  });

  // Calculate totals whenever repairEstimate changes
  const calculateRepairTotals = () => {
    const majorSystemsTotal = Object.values(repairEstimate.majorSystems).reduce((sum, item) => sum + item.cost, 0);
    const roomsTotal = Object.values(repairEstimate.rooms).reduce((sum, item) => sum + item.cost, 0);
    const quickEstimate = majorSystemsTotal + roomsTotal;
    const finalBudget = quickEstimate * (1 + repairEstimate.contingencyPercent / 100);
    
    return { quickEstimate, finalBudget };
  };

  const { quickEstimate, finalBudget } = calculateRepairTotals();
  const repairCost = quickEstimate; // For 70% rule calculation

  // Update major system condition
  const updateMajorSystem = (system, field, value) => {
    setRepairEstimate(prev => ({
      ...prev,
      majorSystems: {
        ...prev.majorSystems,
        [system]: {
          ...prev.majorSystems[system],
          [field]: value
        }
      }
    }));
  };

  // Update room condition
  const updateRoom = (room, field, value) => {
    setRepairEstimate(prev => ({
      ...prev,
      rooms: {
        ...prev.rooms,
        [room]: {
          ...prev.rooms[room],
          [field]: value
        }
      }
    }));
  };

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

  // Checklist items (updated with repair subtasks)
  const [checklist, setChecklist] = useState([
    { id: 1, task: "Collect Property Info", completed: true, subtasks: ["Photos uploaded", "Sq Ft confirmed", "Year Built verified"] },
    { id: 2, task: "ARV Estimate", completed: true, subtasks: ["6 comps found"] },
    { 
      id: 3, 
      task: "Repair Cost Estimate", 
      completed: false, 
      subtasks: [
        `Major Systems: $${Object.values(repairEstimate.majorSystems).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}`,
        `Room Finishes: $${Object.values(repairEstimate.rooms).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}`,
        `Quick Estimate: $${quickEstimate.toLocaleString()}`,
        `With ${repairEstimate.contingencyPercent}% Contingency: $${finalBudget.toLocaleString()}`
      ] 
    },
    { id: 4, task: "Market Health Check", completed: true, subtasks: ["Job Growth: +3.2%", "School Rating: 7/10", "Crime Trend: ↓5%"] },
    { id: 5, task: "70% Rule", completed: false, subtasks: [] },
  ]);

  const toggleTask = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  // Condition options for dropdowns
  const majorSystemConditions = [
    { value: "New", cost: 0 },
    { value: "Good", cost: 0 },
    { value: "Fair", cost: 5000 },
    { value: "Poor", cost: 8000 },
    { value: "Replace", cost: 12000 }
  ];

  const roomConditions = [
    { value: "New", cost: 0 },
    { value: "Cosmetic", cost: 5000 },
    { value: "Paint/Flooring", cost: 8000 },
    { value: "Partial Gut", cost: 15000 },
    { value: "Full Gut", cost: 25000 }
  ];

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

      {/* Main Content - Updated with 2/3 - 1/3 split but now with detailed repair section */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Checklist + Repair Details (2/3 width) */}
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

          {/* NEW: Detailed Repair Assessment Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">🔨 Quick Repair Assessment</h3>
            
            <div className="space-y-6">
              {/* Major Systems */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Major Systems</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(repairEstimate.majorSystems).map(([system, data]) => (
                    <div key={system} className="border rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-600 capitalize mb-2">
                        {system}
                      </label>
                      <select 
                        value={data.condition}
                        onChange={(e) => {
                          const selected = majorSystemConditions.find(c => c.value === e.target.value);
                          updateMajorSystem(system, 'condition', e.target.value);
                          updateMajorSystem(system, 'cost', selected.cost);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {majorSystemConditions.map(cond => (
                          <option key={cond.value} value={cond.value}>
                            {cond.value} {cond.cost > 0 ? `(+$${cond.cost.toLocaleString()})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Room-by-Room */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Room Finishes</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(repairEstimate.rooms).map(([room, data]) => (
                    <div key={room} className="border rounded-lg p-3">
                      <label className="block text-sm font-medium text-gray-600 capitalize mb-2">
                        {room.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <select 
                        value={data.condition}
                        onChange={(e) => {
                          const selected = roomConditions.find(c => c.value === e.target.value);
                          updateRoom(room, 'condition', e.target.value);
                          updateRoom(room, 'cost', selected.cost);
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      >
                        {roomConditions.map(cond => (
                          <option key={cond.value} value={cond.value}>
                            {cond.value} {cond.cost > 0 ? `(+$${cond.cost.toLocaleString()})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Repair Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Quick Estimate</p>
                    <p className="text-2xl font-bold text-blue-600">${quickEstimate.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Contingency</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="5"
                        max="25"
                        step="1"
                        value={repairEstimate.contingencyPercent}
                        onChange={(e) => setRepairEstimate(prev => ({ ...prev, contingencyPercent: Number(e.target.value) }))}
                        className="w-24"
                      />
                      <span className="font-medium">{repairEstimate.contingencyPercent}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Final Budget</p>
                    <p className="text-2xl font-bold text-green-600">${finalBudget.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Deal Flow Checklist</h3>
            
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

              {/* Repair Cost Display - Now shows detailed breakdown */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Repair Costs (from assessment)</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Major Systems:</span>
                  <span className="font-medium">${Object.values(repairEstimate.majorSystems).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Room Finishes:</span>
                  <span className="font-medium">${Object.values(repairEstimate.rooms).reduce((sum, item) => sum + item.cost, 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t mt-2">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-blue-600">${repairCost.toLocaleString()}</span>
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