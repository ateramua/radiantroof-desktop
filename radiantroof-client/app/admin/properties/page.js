"use client";
import Image from 'next/image'

import { useEffect, useState } from "react";
import {
  getProperties,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

export default function AdminPropertiesPage() {
  const emptyForm = {
    address: "",
    city: "",
    state: "",
    zip: "",
    price: "",
    arv: "",
    estimatedRepairs: "",
    beds: "",
    baths: "",
    sqft: "",
    description: "",
    status: "Available",
    photo: "", // added for image URL
  };

  const [form, setForm] = useState(emptyForm);
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD PROPERTIES FUNCTION
  ========================= */
  async function loadProperties() {
    try {
      const data = await getProperties();
      setProperties(data);
    } catch (err) {
      console.error("Failed to load properties:", err);
    }
  }

  /* =========================
     EFFECT
  ========================= */
  useEffect(() => {
    loadProperties();
  }, []);

  /* =========================
     FORM HANDLING
  ========================= */
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE}/api/images/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setForm({ ...form, photo: data.url });
    } catch (err) {
      console.error("Image upload error:", err);
      alert("Image upload failed");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      ...form,
      price: Number(form.price),
      arv: form.arv ? Number(form.arv) : null,
      estimatedRepairs: form.estimatedRepairs
        ? Number(form.estimatedRepairs)
        : null,
      beds: form.beds ? Number(form.beds) : null,
      baths: form.baths ? Number(form.baths) : null,
      sqft: form.sqft ? Number(form.sqft) : null,
      photo: form.photo || null, // include image URL
    };

    try {
      if (editingId) {
        await updateProperty(editingId, formattedData);
      } else {
        await createProperty(formattedData);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadProperties();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Error saving property");
    }

    setLoading(false);
  }

  function handleEdit(property) {
    setEditingId(property.id);

    setForm({
      address: property.address || "",
      city: property.city || "",
      state: property.state || "",
      zip: property.zip || "",
      price: property.price || "",
      arv: property.arv || "",
      estimatedRepairs: property.estimatedRepairs || "",
      beds: property.beds || "",
      baths: property.baths || "",
      sqft: property.sqft || "",
      description: property.description || "",
      status: property.status || "Available",
      photo: property.photo || "", // load existing image
    });
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      await deleteProperty(id);
      await loadProperties();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete property");
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        {editingId ? "Edit Property" : "Add New Property"}
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 mb-12">
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
        <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
        <input name="state" placeholder="State" value={form.state} onChange={handleChange} required />
        <input name="zip" placeholder="Zip Code" value={form.zip} onChange={handleChange} required />

        <input name="price" type="number" placeholder="Purchase Price" value={form.price} onChange={handleChange} required />
        <input name="arv" type="number" placeholder="ARV" value={form.arv} onChange={handleChange} />
        <input name="estimatedRepairs" type="number" placeholder="Estimated Repairs" value={form.estimatedRepairs} onChange={handleChange} />

        <input name="beds" type="number" placeholder="Beds" value={form.beds} onChange={handleChange} />
        <input name="baths" type="number" placeholder="Baths" value={form.baths} onChange={handleChange} />
        <input name="sqft" type="number" placeholder="Square Feet" value={form.sqft} onChange={handleChange} />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="col-span-2 border p-2"
        >
          <option value="Available">Available</option>
          <option value="Under Review">Under Review</option>
          <option value="Offer Made">Offer Made</option>
          <option value="Under Contract">Under Contract</option>
          <option value="Sold">Sold</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="col-span-2 border p-2"
        />

        {/* Image Upload */}
        <div className="col-span-2">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {form.photo && (
            <Image src={form.photo} alt="Preview" className="h-32 mt-2 rounded" />
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-black text-white py-2 rounded"
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Property"
            : "Create Property"}
        </button>
      </form>

      {/* LIST */}
      <h2 className="text-2xl font-bold mb-4">Existing Properties</h2>

      <div className="space-y-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{property.address}</div>
              <div className="text-sm text-gray-600">
                ${property.price?.toLocaleString()} — {property.status}
              </div>

              {/* Display property image if exists */}
              {property.photo && (
                <Image src={property.photo} alt="Property" className="h-20 rounded" />
              )}
            </div>

            <div className="space-x-2">
              <button
                onClick={() => handleEdit(property)}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(property.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}