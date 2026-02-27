export default async function PropertiesPage() {
  let properties = [];

  try {
    const res = await fetch("http://localhost:5000/properties", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data = await res.json();

    console.log("SERVER DATA:", data);

    // Ensure we ALWAYS have an array
    if (Array.isArray(data)) {
      properties = data;
    } else if (Array.isArray(data?.properties)) {
      properties = data.properties;
    } else {
      properties = [];
    }
  } catch (error) {
    console.error("SERVER FETCH ERROR:", error);
    properties = [];
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>Properties</h1>

      {properties.length === 0 ? (
        <p>No properties found.</p>
      ) : (
        properties.map((property) => (
          <div key={property?.id} style={{ marginBottom: "20px" }}>
            <h3>{property?.address || "No Address"}</h3>
            <p>{property?.country || "USA"}</p>
            <p>${property?.price || 0}</p>
          </div>
        ))
      )}
    </div>
  );
}