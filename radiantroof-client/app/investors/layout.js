import React from "react";
import DashboardSidebar from "../../components/DashboardSidebar";

export default function InvestorLayout({ children }) {
  return (
    <div className="flex gap-6">
      <DashboardSidebar userType="investor" />
      <div className="flex-1">{children}</div>
    </div>
  );
}