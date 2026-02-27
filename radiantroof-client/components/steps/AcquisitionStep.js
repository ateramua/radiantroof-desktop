import React, { useState, useEffect } from "react";
import { updateProperty, fetchOffers, addOffer } from "../../lib/api";

export default function AcquisitionStep({ propertyId }) {
  const [acquisition, setAcquisition] = useState({
    closeDate: "",
    finalPrice: 0,
    financingDetails: "",
    notes: "",
  });

  const [offers, setOffers] = useState([]);
  const [newOffer, setNewOffer] = useState({
    amount: 0,
    terms: "",
  });

  useEffect(() => {
    async function loadOffers() {
      try {
        const fetched = await fetchOffers(propertyId);
        setOffers(fetched);
      } catch (error) {
        console.error("Failed to load offers:", error);
      }
    }
    loadOffers();
  }, [propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAcquisition((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfferChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({ ...prev, [name]: name === 'amount' ? Number(value) : value }));
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      const updatedOffers = await addOffer(propertyId, newOffer);
      setOffers(updatedOffers);
      setNewOffer({ amount: 0, terms: "" });
      alert("Offer added successfully!");
    } catch (error) {
      console.error("Failed to add offer:", error);
      alert("Error adding offer");
    }
  };

  const handleSave = async () => {
    try {
      await updateProperty(propertyId, { acquisition });
      alert("Acquisition data saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Error saving data");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-6">
      <h3 className="text-xl font-bold mb-4">Acquisition Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Close Date</label>
          <input
            type="date"
            name="closeDate"
            value={acquisition.closeDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Final Price ($)</label>
          <input
            type="number"
            name="finalPrice"
            value={acquisition.finalPrice}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Financing Details</label>
        <textarea
          name="financingDetails"
          value={acquisition.financingDetails}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium">Notes</label>
        <textarea
          name="notes"
          value={acquisition.notes}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div className="border-t pt-4">
        <h4 className="font-bold mb-3">Offers</h4>
        
        <div className="mb-4">
          <form onSubmit={handleAddOffer} className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Offer Amount ($)</label>
                <input
                  type="number"
                  name="amount"
                  value={newOffer.amount}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Terms</label>
                <input
                  type="text"
                  name="terms"
                  value={newOffer.terms}
                  onChange={handleOfferChange}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Cash, Financing"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Add Offer
            </button>
          </form>
        </div>

        <div className="space-y-2">
          <h5 className="font-semibold">Existing Offers</h5>
          {offers.length === 0 ? (
            <p className="text-gray-500">No offers yet</p>
          ) : (
            offers.map((offer, index) => (
              <div key={index} className="border p-3 rounded">
                <p>Amount: ${offer.amount?.toLocaleString()}</p>
                <p>Terms: {offer.terms}</p>
                <p className="text-sm text-gray-500">
                  Added: {new Date(offer.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Save Acquisition Details
      </button>
    </div>
  );
}