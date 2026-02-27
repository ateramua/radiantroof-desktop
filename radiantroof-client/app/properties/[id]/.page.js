"use client";

import React, { useState, useEffect } from "react";
import WorkflowStepper from "../../../components/layout/WorkflowStepper";
import CriteriaStep from "../../../components/steps/CriteriaStep";
import OpportunitiesStep from "../../../components/steps/OpportunitiesStep";
import ScreeningStep from "../../../components/steps/ScreeningStep";
import AnalysisStep from "../../../components/steps/AnalysisStep";
import DecisionStep from "../../../components/steps/DecisionStep";
import AcquisitionStep from "../../../components/steps/AcquisitionStep";
import DealSidebar from "../../../components/DealSidebar";
import { fetchProperty } from "../../../lib/api";

export default function PropertyWorkflowPage({ params }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = params;

  // Centralized state for all metrics that appear in the sidebar
  const [metrics, setMetrics] = useState({
    propertyName: "",
    arv: 0,
    repairs: 0,
    askingPrice: 0,
    mao: 0,
    projectedProfit: 0,
    cashOnCash: 0,
    dealScore: 0,
  });

  // Handlers to update metrics from child steps
  const updateMetrics = (newData) => {
    setMetrics((prev) => ({ ...prev, ...newData }));
  };

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await fetchProperty(id);
        setProperty(data);
        
        // Initialize metrics from property data
        setMetrics({
          propertyName: data.address || "Unknown Property",
          arv: data.analysis?.arv || 0,
          repairs: data.analysis?.repairs || 0,
          askingPrice: data.price || 0,
          mao: data.analysis?.mao || 0,
          projectedProfit: data.analysis?.projectedProfit || 0,
          cashOnCash: data.analysis?.cashOnCash || 0,
          dealScore: data.analysis?.dealScore || 0,
        });
      } catch (err) {
        setError("Failed to load property");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [id]);

  const steps = [
    { id: "criteria", label: "Criteria", component: <CriteriaStep propertyId={id} updateMetrics={updateMetrics} /> },
    { id: "opportunities", label: "Opportunities", component: <OpportunitiesStep propertyId={id} /> },
    { id: "screening", label: "Screening", component: <ScreeningStep propertyId={id} updateMetrics={updateMetrics} /> },
    { id: "analysis", label: "Analysis", component: <AnalysisStep propertyId={id} updateMetrics={updateMetrics} /> },
    { id: "decision", label: "Decision", component: <DecisionStep propertyId={id} /> },
    { id: "acquisition", label: "Acquisition", component: <AcquisitionStep propertyId={id} /> },
  ];

  if (loading) return <div className="text-center py-10">Loading property...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="md:w-1/4">
        <DealSidebar step={currentStep} data={metrics} />
      </aside>
      <div className="md:flex-1">
        <WorkflowStepper
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <div className="hidden md:block mt-4">{steps[currentStep].component}</div>
      </div>
    </div>
  );
}