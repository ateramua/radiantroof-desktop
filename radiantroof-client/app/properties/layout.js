import React from "react";

export default function PropertiesLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar is now inside the page component for better state management */}
          {/* But we keep the layout structure for future expansion */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}