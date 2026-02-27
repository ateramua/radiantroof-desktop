import React, { useState } from "react";

export default function WorkflowStepper({ steps, currentStep, setCurrentStep }) {
  const [accordionOpen, setAccordionOpen] = useState(null);

  return (
    <div>
      {/* Desktop Stepper */}
      <div className="hidden md:flex justify-between items-center bg-gray-50 p-4 rounded shadow">
        {steps.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(idx)}
            className={`cursor-pointer flex-1 text-center px-2 py-1 rounded transition ${
              idx === currentStep
                ? "bg-blue-500 text-white font-bold"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {step.label}
          </button>
        ))}
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden space-y-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="border rounded overflow-hidden">
            <button
              className={`w-full flex justify-between items-center px-4 py-2 transition ${
                idx === currentStep ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
              }`}
              onClick={() => setAccordionOpen(accordionOpen === idx ? null : idx)}
            >
              <span>{step.label}</span>
              <span>{accordionOpen === idx ? "▲" : "▼"}</span>
            </button>
            {accordionOpen === idx && (
              <div className="p-4 bg-white shadow-inner rounded-b">{step.component}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}