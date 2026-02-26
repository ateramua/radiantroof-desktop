import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-[#004F2D] shadow p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl text-white hover:text-[#A6F0C6]">
        Radiant Roof
      </Link>
      <nav className="space-x-4">
        <Link href="/" className="text-white hover:text-[#A6F0C6]">Home</Link>
        <Link href="/properties" className="text-white hover:text-[#A6F0C6]">Properties</Link>
        <Link href="/investors" className="text-white hover:text-[#A6F0C6]">Investors</Link>
        <Link href="/about" className="text-white hover:text-[#A6F0C6]">About</Link>
        <Link href="/contact" className="text-white hover:text-[#A6F0C6]">Contact</Link>
        <Link href="/dashboard" className="text-white hover:text-[#A6F0C6]">Dashboard</Link>
        <Link href="/admin" className="text-white hover:text-[#A6F0C6]">Admin</Link>
        <Link href="/admin">
          <button className="px-4 py-2 bg-white text-[#004F2D] rounded hover:bg-[#A6F0C6] transition">
            Go to Admin Workflow
          </button>
        </Link>
      </nav>
    </header>
  );
}