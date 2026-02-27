"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    if (user) router.push("/dashboard");
    else router.push("/login");
  };

  const handleAdminClick = () => {
    if (user?.isAdmin) router.push("/admin");
    else router.push("/login");
  };

  return (
    <header className="bg-[#004F2D] shadow p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl text-white hover:text-[#A6F0C6]">
        Radiant Roof
      </Link>

      <nav className="space-x-4 flex items-center">
        {/* Public Links */}
        <Link href="/" className="text-white hover:text-[#A6F0C6]">Home</Link>
        <Link href="/properties" className="text-white hover:text-[#A6F0C6]">Properties</Link>
        <Link href="/investors" className="text-white hover:text-[#A6F0C6]">Investors</Link>
        <Link href="/about" className="text-white hover:text-[#A6F0C6]">About</Link>
        <Link href="/contact" className="text-white hover:text-[#A6F0C6]">Contact</Link>

        {/* Authenticated Buttons */}
        <button
          onClick={handleDashboardClick}
          className="px-3 py-1 bg-white text-[#004F2D] rounded hover:bg-[#A6F0C6] transition"
        >
          Dashboard
        </button>

        <button
          onClick={handleAdminClick}
          className="px-4 py-2 bg-white text-[#004F2D] rounded hover:bg-[#A6F0C6] transition"
        >
          Admin
        </button>
      </nav>
    </header>
  );
}