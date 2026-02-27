import React, { useState } from "react";
import { updateProperty } from "../../lib/api";

export default function DecisionStep({ propertyId }) {
  const [decision, setDecision] = useState({
    status: "Under Review",
    offerAmount: 200000,
    contingencies: "",
    targetCloseDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDecision((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setDecision((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProperty(propertyId, { decision });
      alert("Decision saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h3 className="text-xl font-bold mb-4">Investment Decision</h3>
      
      <div>
        <label className="block mb-1 font-medium">Decision Status</label>
        <select
          name="status"
          value={decision.status}
          onChange={handleSelectChange}
          className="w-full p-2 border rounded"
        >
          <option>Under Review</option>
          <option>Make Offer</option>
          <option>Pass</option>
          <option>Offer Accepted</option>
          <option>Offer Rejected</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Offer Amount ($)</label>
        <input
          type="number"
          name="offerAmount"
          value={decision.offerAmount}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          min="0"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Contingencies</label>
        <textarea
          name="contingencies"
          value={decision.contingencies}
          onChange={handleChange}
          placeholder="e.g., Inspection, Financing"
          className="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Target Close Date</label>
        <input
          type="date"
          name="targetCloseDate"
          value={decision.targetCloseDate}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Save Decision
      </button>
    </div>
  );
}