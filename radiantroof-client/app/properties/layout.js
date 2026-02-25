import React from "react";

export default function PropertiesLayout({ children }) {
  return (
    <div className="flex gap-6">
      <aside className="w-1/4 bg-gray-50 p-4 rounded shadow">
        <h3 className="font-bold mb-4">Filters</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> For Sale
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Pending
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Sold
          </label>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}