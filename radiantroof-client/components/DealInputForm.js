'use client';
import { useState, useEffect } from 'react';  // import hooks
import WorkflowStepper from "@/components/layout/WorkflowStepper"; // <-- add this
export default function DealInputForm({ dealData, setDealData }) {
  const [activeStep, setActiveStep] = useState(1);
  
  const updateField = (field, value) => {
    setDealData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Deal Inputs</h3>
        <WorkflowStepper currentStep={activeStep} steps={5} />
      </div>

      {/* Step 1: Property Value */}
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            After Repair Value (ARV) <span className="text-blue-600">$</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">$</span>
            <input
              type="number"
              value={dealData.arv}
              onChange={(e) => updateField('arv', e.target.value)}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="425,000"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            What will the property be worth after renovations?
          </p>
        </div>

        {/* Step 2: Costs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repair Costs
            </label>
            <input
              type="number"
              value={dealData.repairCosts}
              onChange={(e) => updateField('repairCosts', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="45,000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purchase Price
            </label>
            <input
              type="number"
              value={dealData.purchasePrice}
              onChange={(e) => updateField('purchasePrice', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="335,000"
            />
          </div>
        </div>

        {/* Step 3: Income */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monthly Rent
          </label>
          <input
            type="number"
            value={dealData.monthlyRent}
            onChange={(e) => updateField('monthlyRent', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="2,800"
          />
        </div>

        {/* Step 4: Financing */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Rate %
            </label>
            <input
              type="number"
              step="0.125"
              value={dealData.interestRate}
              onChange={(e) => updateField('interestRate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="6.25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Down Payment %
            </label>
            <input
              type="number"
              value={dealData.downPaymentPercent}
              onChange={(e) => updateField('downPaymentPercent', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="20"
            />
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button 
        onClick={() => calculateDealMetrics(dealData, setDealData)}
        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-600 transition-all transform hover:scale-[1.02]"
      >
        Analyze This Deal →
      </button>
    </div>
  );
}