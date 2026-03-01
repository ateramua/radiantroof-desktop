"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

export default function AcquisitionPage() {
  const { user } = useAuth();
  const [offerAmount, setOfferAmount] = useState(275000);
  const [selectedFinancing, setSelectedFinancing] = useState("private");
  
  // Property details
  const [arv, setArv] = useState(425000);
  const [repairCosts, setRepairCosts] = useState(45000);
  const [askingPrice, setAskingPrice] = useState(325000);
  
  // Calculate max safe offer (70% rule)
  const maxSafeOffer = arv * 0.7 - repairCosts;
  
  // Calculate win probability based on offer amount
  const calculateWinProbability = (offer) => {
    const percentOfAsking = (offer / askingPrice) * 100;
    if (percentOfAsking >= 100) return 85;
    if (percentOfAsking >= 95) return 70;
    if (percentOfAsking >= 90) return 55;
    if (percentOfAsking >= 85) return 40;
    if (percentOfAsking >= 80) return 25;
    return 10;
  };
  
  // Calculate profit at different offer levels
  const calculateProfit = (offer) => {
    return arv - offer - repairCosts - 18500 - 8400; // ARV - offer - repairs - closing - holding
  };
  
  const winProbability = calculateWinProbability(offerAmount);
  const projectedProfit = calculateProfit(offerAmount);
  const isOverMaxSafe = offerAmount > maxSafeOffer;
  
  // Offer scenarios
  const scenarios = [
    { 
      name: "Conservative", 
      offer: Math.round(maxSafeOffer * 0.95), 
      profit: calculateProfit(Math.round(maxSafeOffer * 0.95)),
      winRate: calculateWinProbability(Math.round(maxSafeOffer * 0.95))
    },
    { 
      name: "Balanced", 
      offer: Math.round(maxSafeOffer), 
      profit: calculateProfit(Math.round(maxSafeOffer)),
      winRate: calculateWinProbability(Math.round(maxSafeOffer))
    },
    { 
      name: "Aggressive", 
      offer: Math.round(maxSafeOffer * 1.1), 
      profit: calculateProfit(Math.round(maxSafeOffer * 1.1)),
      winRate: calculateWinProbability(Math.round(maxSafeOffer * 1.1))
    },
  ];

  // Financing options
  const financingOptions = {
    hard: {
      name: "Hard Money",
      rate: 12.5,
      points: 2,
      ltv: 70,
      monthlyPayment: ((offerAmount * 0.7) * 0.125 / 12).toFixed(0),
      icon: "💰"
    },
    private: {
      name: "Private Money",
      rate: 10,
      points: 0,
      ltv: 75,
      monthlyPayment: ((offerAmount * 0.75) * 0.10 / 12).toFixed(0),
      icon: "🤝"
    },
    conventional: {
      name: "Conventional",
      rate: 7.5,
      points: 1,
      ltv: 80,
      monthlyPayment: ((offerAmount * 0.8) * 0.075 / 12).toFixed(0),
      icon: "🏦"
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Acquisition</h1>
          <p className="text-sm text-gray-500 mt-1">
            Optimize your offer and secure financing
          </p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>123 Main St</option>
            <option>456 Oak Ave</option>
            <option>789 Pine St</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Offer Optimizer (2/3 width) */}
        <div className="col-span-2 space-y-6">
          {/* Property Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">123 Main St</h2>
                <p className="text-sm text-gray-500">Asking Price: ${askingPrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Max Safe Offer (70% Rule)</p>
                <p className="text-2xl font-bold text-blue-600">${maxSafeOffer.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Offer Optimizer */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Offer Optimizer</h3>
            
            <div className="space-y-6">
              {/* Offer Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Your Offer</span>
                  <span className="text-2xl font-bold text-blue-600">${offerAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={maxSafeOffer * 0.8}
                  max={askingPrice * 1.1}
                  step={1000}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>${Math.round(maxSafeOffer * 0.8).toLocaleString()}</span>
                  <span>Asking: ${askingPrice.toLocaleString()}</span>
                  <span>${Math.round(askingPrice * 1.1).toLocaleString()}</span>
                </div>
              </div>

              {/* Offer Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Win Probability</p>
                  <p className="text-2xl font-bold text-blue-600">{winProbability}%</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Projected Profit</p>
                  <p className={`text-2xl font-bold ${projectedProfit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${projectedProfit.toLocaleString()}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">vs Asking</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {offerAmount > askingPrice ? '+' : '-'}${Math.abs(offerAmount - askingPrice).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Warning if over max safe */}
              {isOverMaxSafe && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This offer exceeds your maximum safe offer by ${(offerAmount - maxSafeOffer).toLocaleString()}
                  </p>
                </div>
              )}

              {/* Offer Scenarios */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Offer Scenarios</h4>
                <div className="grid grid-cols-3 gap-3">
                  {scenarios.map((scenario) => (
                    <div
                      key={scenario.name}
                      onClick={() => setOfferAmount(scenario.offer)}
                      className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-md ${
                        Math.abs(offerAmount - scenario.offer) < 1000 ? 'border-blue-500 bg-blue-50' : ''
                      }`}
                    >
                      <p className="font-medium text-sm">{scenario.name}</p>
                      <p className="text-lg font-bold mt-1">${scenario.offer.toLocaleString()}</p>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-gray-500">Profit:</span>
                        <span className={scenario.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                          ${scenario.profit.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Win Rate:</span>
                        <span className="text-blue-600">{scenario.winRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex space-x-3">
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center space-x-2">
                <span>📝</span>
                <span>Generate Offer Letter</span>
              </button>
              <button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Contact Seller</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Financing Options (1/3 width) */}
        <div className="space-y-6">
          {/* Financing Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Financing Options</h3>
            
            <div className="space-y-3">
              {/* Hard Money */}
              <div
                onClick={() => setSelectedFinancing("hard")}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedFinancing === "hard" ? 'border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{financingOptions.hard.icon}</span>
                    <h4 className="font-semibold">{financingOptions.hard.name}</h4>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedFinancing === "hard" ? 'bg-blue-200 text-blue-800' : 'bg-gray-100'
                  }`}>
                    {financingOptions.hard.rate}% | {financingOptions.hard.points} pts
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Monthly</p>
                    <p className="font-medium">${financingOptions.hard.monthlyPayment}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">LTV</p>
                    <p className="font-medium">{financingOptions.hard.ltv}%</p>
                  </div>
                </div>
              </div>

              {/* Private Money */}
              <div
                onClick={() => setSelectedFinancing("private")}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedFinancing === "private" ? 'border-green-500 bg-green-50' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{financingOptions.private.icon}</span>
                    <h4 className="font-semibold">{financingOptions.private.name}</h4>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Monthly</p>
                    <p className="font-medium">${financingOptions.private.monthlyPayment}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">LTV</p>
                    <p className="font-medium">{financingOptions.private.ltv}%</p>
                  </div>
                </div>
              </div>

              {/* Conventional */}
              <div
                onClick={() => setSelectedFinancing("conventional")}
                className={`border rounded-lg p-4 cursor-pointer transition ${
                  selectedFinancing === "conventional" ? 'border-purple-500 bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">{financingOptions.conventional.icon}</span>
                  <h4 className="font-semibold">{financingOptions.conventional.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Monthly</p>
                    <p className="font-medium">${financingOptions.conventional.monthlyPayment}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">LTV</p>
                    <p className="font-medium">{financingOptions.conventional.ltv}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Private Money Matchmaker */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">🤝 Private Money Matchmaker</h3>
            <p className="text-sm text-gray-500 mb-3">Lenders interested in deals like yours</p>
            
            <div className="space-y-3">
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Michael R.</p>
                    <p className="text-xs text-gray-500">💰 $100k-$500k @ 10-12%</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:underline">Connect</button>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Sarah K.</p>
                    <p className="text-xs text-gray-500">💰 $50k-$300k @ 9-11%</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:underline">Connect</button>
                </div>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Robert Chen</p>
                    <p className="text-xs text-gray-500">💰 $200k-$1M @ 10-13%</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:underline">Connect</button>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 text-center text-sm text-purple-600 hover:underline">
              View All Lenders →
            </button>
          </div>

          {/* Deal Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Deal Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Offer Amount</span>
                <span className="font-medium">${offerAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Loan Amount ({(financingOptions[selectedFinancing].ltv)}% LTV)</span>
                <span className="font-medium">${Math.round(offerAmount * financingOptions[selectedFinancing].ltv / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Down Payment</span>
                <span className="font-medium">${Math.round(offerAmount * (100 - financingOptions[selectedFinancing].ltv) / 100).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Cash Needed</span>
                <span className="font-bold text-blue-600">
                  ${Math.round(offerAmount * (100 - financingOptions[selectedFinancing].ltv) / 100 + (offerAmount * financingOptions[selectedFinancing].points / 100)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}