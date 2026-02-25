const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Property endpoints
export async function getProperties() {
  const res = await fetch(`${API_BASE}/properties`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function getProperty(id) {
  const res = await fetch(`${API_BASE}/properties/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json();
}

export async function fetchProperty(id) {
  return getProperty(id); // Alias for consistency
}

export async function updateProperty(id, data) {
  const res = await fetch(`${API_BASE}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update property");
  return res.json();
}

// Screening endpoints
export async function updateScreening(id, screening) {
  return updateProperty(id, { screening });
}

// Analysis endpoints
export async function updateAnalysis(id, analysis) {
  return updateProperty(id, { analysis });
}

// Decision endpoints
export async function updateDecision(id, decision) {
  return updateProperty(id, { decision });
}

// Offer endpoints
export async function fetchOffers(id) {
  const res = await fetch(`${API_BASE}/properties/${id}/offers`);
  if (!res.ok) throw new Error("Failed to fetch offers");
  return res.json();
}

export async function addOffer(id, offer) {
  const res = await fetch(`${API_BASE}/properties/${id}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offer }),
  });
  if (!res.ok) throw new Error("Failed to add offer");
  return res.json();
}

export async function updateOfferStatus(id, status) {
  const res = await fetch(`${API_BASE}/properties/${id}/offers`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update offer status");
  return res.json();
}