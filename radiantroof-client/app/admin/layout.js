import React from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex gap-6">
      <DashboardSidebar userType="admin" />
      <div className="flex-1">{children}</div>
    </div>
  );
}