import React from "react";
import Link from "next/link";

export default function DashboardSidebar({ userType }) {
  const investorLinks = [
    { href: "/investors", label: "Dashboard" },
    { href: "/investors/portfolio", label: "Portfolio" },
    { href: "/investors/transactions", label: "Transactions" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/properties", label: "Properties" },
    { href: "/admin/users", label: "Users" },
  ];

  const links = userType === "admin" ? adminLinks : investorLinks;

  return (
    <aside className="w-64 bg-white p-4 shadow rounded min-h-screen">
      <h3 className="font-bold mb-4">
        {userType === "admin" ? "Admin Panel" : "Investor Dashboard"}
      </h3>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block p-2 hover:bg-gray-100 rounded transition"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="text-xs text-gray-400 mt-8">⏳ Dynamic data pending</p>
    </aside>
  );
}