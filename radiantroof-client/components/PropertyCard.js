import React from "react";
import Link from "next/link";

export default function PropertyCard({ property }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <div className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer">
        <h3 className="font-bold text-lg">{property.address || property.name}</h3>
        <p className="text-gray-700">${property.price?.toLocaleString()}</p>
        <p className="text-sm text-gray-500 mt-2">
          Status: {property.status || "Available"}
        </p>
      </div>
    </Link>
  );
}