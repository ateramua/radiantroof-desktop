"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

// NEW: Offer Scenario Component
const OfferScenario = ({ name, offer, profit, winRate, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-md ${
      isSelected ? 'border-blue-500 bg-blue-50' : ''
    }`}
  >
    <p className="font-medium text-sm">{name}</p>
    <p className="text-lg font-bold mt-1">${offer.toLocaleString()}</p>
    <div className="flex justify-between text-xs mt-2">
      <span className="text-gray-500">Profit:</span>
      <span className={profit > 0 ? 'text-green-600' : 'text-red-600'}>
        ${profit.toLocaleString()}
      </span>
    </div>
    <div className="flex justify-between text-xs">
      <span className="text-gray-500">Win Rate:</span>
      <span className="text-blue-600">{winRate}%</span>
    </div>
  </div>
);

// NEW: Financing Option Card
const FinancingOption = ({ option, type, isSelected, onSelect }) => (
  <div
    onClick={() => onSelect(type)}
    className={`border rounded-lg p-4 cursor-pointer transition ${
      isSelected ? 'border-green-500 bg-green-50' : ''
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center space-x-2">
        <span className="text-2xl">{option.icon}</span>
        <h4 className="font-semibold">{option.name}</h4>
      </div>
      {type === 'private' && (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Recommended
        </span>
      )}
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <p className="text-gray-500">Rate</p>
        <p className="font-medium">{option.rate}%</p>
      </div>
      <div>
        <p className="text-gray-500">Points</p>
        <p className="font-medium">{option.points}</p>
      </div>
      <div>
        <p className="text-gray-500">LTV</p>
        <p className="font-medium">{option.ltv}%</p>
      </div>
      <div>
        <p className="text-gray-500">Monthly</p>
        <p className="font-medium">${option.monthlyPayment}</p>
      </div>
    </div>
  </div>
);

export default function AcquisitionPage() {
  const { user } = useAuth();
  const [offerAmount, setOfferAmount] = useState(275000);
  const [selectedFinancing, setSelectedFinancing] = useState("private");
  
  // Load deal data from localStorage (passed from screening/analysis)
  const [dealData, setDealData] = useState({
    address: "123 Main St",
    askingPrice: 325000,
    arv: 425000,
    repairCosts: 45000,
    repairCostsWithContingency: 51750,
    holdingCosts: 8400,
    closingCosts: 18500,
    desiredProfit: 40000,
    propertyType: 'flip'
  });

  useEffect(() => {
    // Load deal data from localStorage
    const savedDeal = localStorage.getItem('currentDeal');
    if (savedDeal) {
      try {
        const parsed = JSON.parse(savedDeal);
        setDealData(prev => ({
          ...prev,
          ...parsed,
          address: parsed.address || prev.address,
          askingPrice: parsed.askingPrice || prev.askingPrice,
          arv: parsed.arv || prev.arv,
          repairCosts: parsed.quickRepairEstimate || parsed.repairCosts || prev.repairCosts,
          repairCostsWithContingency: parsed.repairCostsWithContingency || 
            (parsed.quickRepairEstimate ? parsed.quickRepairEstimate * 1.15 : prev.repairCostsWithContingency)
        }));
      } catch (e) {
        console.error('Error loading deal data:', e);
      }
    }
  }, []);

  // Calculate max safe offer (70% rule) - using repair costs WITH contingency
  const maxSafeOffer = dealData.arv * 0.7 - dealData.repairCostsWithContingency;
  
  // Calculate MAO (Maximum Allowable Offer)
  const mao = dealData.arv - dealData.repairCostsWithContingency - dealData.desiredProfit;
  
  // Calculate win probability based on offer amount
  const calculateWinProbability = (offer) => {
    const percentOfAsking = (offer / dealData.askingPrice) * 100;
    if (percentOfAsking >= 100) return 85;
    if (percentOfAsking >= 95) return 70;
    if (percentOfAsking >= 90) return 55;
    if (percentOfAsking >= 85) return 40;
    if (percentOfAsking >= 80) return 25;
    return 10;
  };
  
  // Calculate profit at different offer levels
  const calculateProfit = (offer) => {
    return dealData.arv - offer - dealData.repairCostsWithContingency - dealData.closingCosts - dealData.holdingCosts;
  };
  
  const winProbability = calculateWinProbability(offerAmount);
  const projectedProfit = calculateProfit(offerAmount);
  const isOverMaxSafe = offerAmount > maxSafeOffer;
  const isOverMao = offerAmount > mao;
  
  // Offer scenarios
  const scenarios = [
    { 
      name: "Conservative", 
      offer: Math.round(mao * 0.9), 
      profit: calculateProfit(Math.round(mao * 0.9)),
      winRate: calculateWinProbability(Math.round(mao * 0.9))
    },
    { 
      name: "Balanced", 
      offer: Math.round(mao), 
      profit: calculateProfit(Math.round(mao)),
      winRate: calculateWinProbability(Math.round(mao))
    },
    { 
      name: "Aggressive", 
      offer: Math.round(mao * 1.1), 
      profit: calculateProfit(Math.round(mao * 1.1)),
      winRate: calculateWinProbability(Math.round(mao * 1.1))
    },
  ];

  // Financing options with dynamic calculations based on offer
  const financingOptions = {
    hard: {
      name: "Hard Money",
      rate: 12.5,
      points: 2,
      ltv: 70,
      monthlyPayment: Math.round(((offerAmount * 0.7) * 0.125 / 12)).toLocaleString(),
      icon: "💰"
    },
    private: {
      name: "Private Money",
      rate: 10,
      points: 0,
      ltv: 75,
      monthlyPayment: Math.round(((offerAmount * 0.75) * 0.10 / 12)).toLocaleString(),
      icon: "🤝"
    },
    conventional: {
      name: "Conventional",
      rate: 7.5,
      points: 1,
      ltv: 80,
      monthlyPayment: Math.round(((offerAmount * 0.8) * 0.075 / 12)).toLocaleString(),
      icon: "🏦"
    }
  };

  // Calculate cash needed
  const loanAmount = Math.round(offerAmount * financingOptions[selectedFinancing].ltv / 100);
  const downPayment = offerAmount - loanAmount;
  const pointsCost = Math.round(loanAmount * financingOptions[selectedFinancing].points / 100);
  const cashNeeded = downPayment + pointsCost;

  return (
    <div className="space-y-6">
      {/* Header with Pipeline Navigation */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Acquisition</h1>
          <p className="text-sm text-gray-500 mt-1">
            Optimize your offer and secure financing
          </p>
        </div>
        <div className="flex space-x-3">
          <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm">
            <option>{dealData.address}</option>
          </select>
          <Link href="/dashboard/renovation">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
              → Go to Renovation
            </button>
          </Link>
        </div>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <div className="w-16 h-1 bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">✓</div>
              <div className="w-16 h-1 bg-green-500"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
              <div className="w-16 h-1 bg-gray-300"></div>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">4</div>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium text-blue-600">Acquisition</span> • Phase 3 of 4
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs">
          <span className="text-green-600">✓ Sourcing</span>
          <span className="text-green-600">✓ Screening</span>
          <span className="text-blue-600 font-medium">● Analysis</span>
          <span className="text-gray-400">Renovation</span>
        </div>
      </div>

      {/* Deal Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">ARV</p>
          <p className="text-2xl font-bold text-green-600">${dealData.arv.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Repair Costs</p>
          <p className="text-2xl font-bold text-orange-600">${dealData.repairCostsWithContingency.toLocaleString()}</p>
          <p className="text-xs text-gray-400">Base: ${dealData.repairCosts.toLocaleString()} + 15%</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">Max Safe Offer (70%)</p>
          <p className="text-2xl font-bold text-blue-600">${maxSafeOffer.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-sm text-gray-500">MAO (Target Profit)</p>
          <p className="text-2xl font-bold text-purple-600">${mao.toLocaleString()}</p>
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
                <h2 className="text-xl font-semibold">{dealData.address}</h2>
                <p className="text-sm text-gray-500">Asking Price: ${dealData.askingPrice.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Property Type</p>
                <p className="text-lg font-semibold capitalize">{dealData.propertyType === 'flip' ? '🏠 Fix & Flip' : '💰 Rental Rehab'}</p>
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
                  min={Math.round(mao * 0.8)}
                  max={Math.round(dealData.askingPrice * 1.1)}
                  step={1000}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 text-xs text-gray-400">
                  <span>${Math.round(mao * 0.8).toLocaleString()}</span>
                  <span>MAO: ${mao.toLocaleString()}</span>
                  <span>Asking: ${dealData.askingPrice.toLocaleString()}</span>
                  <span>${Math.round(dealData.askingPrice * 1.1).toLocaleString()}</span>
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
                    {offerAmount > dealData.askingPrice ? '+' : '-'}${Math.abs(offerAmount - dealData.askingPrice).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Warnings */}
              {isOverMaxSafe && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ This offer exceeds your maximum safe offer (70% rule) by ${(offerAmount - maxSafeOffer).toLocaleString()}
                  </p>
                </div>
              )}
              
              {isOverMao && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800">
                    ⚠️ This offer exceeds your MAO by ${(offerAmount - mao).toLocaleString()}. Profit will be less than ${dealData.desiredProfit.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Offer Scenarios */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recommended Offer Scenarios</h4>
                <div className="grid grid-cols-3 gap-3">
                  {scenarios.map((scenario) => (
                    <OfferScenario
                      key={scenario.name}
                      name={scenario.name}
                      offer={scenario.offer}
                      profit={scenario.profit}
                      winRate={scenario.winRate}
                      isSelected={Math.abs(offerAmount - scenario.offer) < 1000}
                      onClick={() => setOfferAmount(scenario.offer)}
                    />
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
              <button className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>View Analysis</span>
              </button>
            </div>
          </div>

          {/* Negotiation Tips */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">💡 Negotiation Tips</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Based on your repair estimate:</span> Highlight the ${dealData.repairCostsWithContingency.toLocaleString()} in needed repairs to justify your offer
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Market comps:</span> Similar properties sold for ${dealData.arv.toLocaleString()} after renovation
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-500">•</span>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Walk-away number:</span> Don't exceed ${mao.toLocaleString()} to maintain ${dealData.desiredProfit.toLocaleString()} profit
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Financing Options (1/3 width) */}
        <div className="space-y-6">
          {/* Financing Options */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">💰 Financing Options</h3>
            
            <div className="space-y-3">
              {Object.entries(financingOptions).map(([key, option]) => (
                <FinancingOption
                  key={key}
                  type={key}
                  option={option}
                  isSelected={selectedFinancing === key}
                  onSelect={setSelectedFinancing}
                />
              ))}
            </div>
          </div>

          {/* Private Money Matchmaker */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">🤝 Private Money Matchmaker</h3>
            <p className="text-sm text-gray-500 mb-3">Lenders interested in {dealData.propertyType === 'flip' ? 'fix & flip' : 'rental'} deals</p>
            
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
            <h3 className="text-lg font-semibold mb-4">📊 Deal Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Offer Amount</span>
                <span className="font-medium">${offerAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Loan Amount</span>
                <span className="font-medium">${loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Down Payment</span>
                <span className="font-medium">${downPayment.toLocaleString()}</span>
              </div>
              {pointsCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Points ({financingOptions[selectedFinancing].points}%)</span>
                  <span className="font-medium">${pointsCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t">
                <span className="font-semibold">Cash Needed at Close</span>
                <span className="font-bold text-blue-600">${cashNeeded.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Monthly Payment</span>
                <span className="font-medium">${financingOptions[selectedFinancing].monthlyPayment}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">⏭️ Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs">1</span>
                <span>Finalize offer amount</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">2</span>
                <span>Secure financing commitment</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">3</span>
                <span>Submit offer with proof of funds</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="w-5 h-5 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs">4</span>
                <span>Open escrow</span>
              </div>
            </div>
            
            <Link href="/dashboard/renovation">
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Continue to Renovation Planning
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}