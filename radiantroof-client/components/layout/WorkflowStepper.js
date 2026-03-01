import React, { useState } from "react";

export default function WorkflowStepper({
  steps = [], // ✅ default empty array
  currentStep = 0,
  setCurrentStep = () => {},
}) {
  const [accordionOpen, setAccordionOpen] = useState(null);

  // Ensure steps is always an array
  const safeSteps = Array.isArray(steps) ? steps : [];

  return (
    <div>
      {/* Desktop Stepper */}
      {safeSteps.length > 0 && (
        <div className="hidden md:flex justify-between items-center bg-gray-50 p-4 rounded shadow">
          {safeSteps.map((step, idx) => (
            <button
              key={step.id ?? idx} // fallback key if id missing
              onClick={() => setCurrentStep(idx)}
              className={`cursor-pointer flex-1 text-center px-2 py-1 rounded transition ${
                idx === currentStep
                  ? "bg-blue-500 text-white font-bold"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              {step.label ?? `Step ${idx + 1}`} {/* fallback label */}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Accordion */}
      {safeSteps.length > 0 && (
        <div className="md:hidden space-y-2">
          {safeSteps.map((step, idx) => (
            <div key={step.id ?? idx} className="border rounded overflow-hidden">
              <button
                className={`w-full flex justify-between items-center px-4 py-2 transition ${
                  idx === currentStep
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => setAccordionOpen(accordionOpen === idx ? null : idx)}
              >
                <span>{step.label ?? `Step ${idx + 1}`}</span>
                <span>{accordionOpen === idx ? "▲" : "▼"}</span>
              </button>
              {accordionOpen === idx && (
                <div className="p-4 bg-white shadow-inner rounded-b">
                  {step.component ?? null} {/* fallback if component missing */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fallback if no steps */}
      {safeSteps.length === 0 && (
        <p className="text-gray-500 text-center py-4">No steps available</p>
      )}
    </div>
  );
}