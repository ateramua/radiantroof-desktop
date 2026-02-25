import React from "react";
import Link from "next/link"

export default function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl hover:text-blue-600">
        Radiant Roof
      </Link>
      <nav className="space-x-4">
        <Link href="/" className="hover:text-blue-600">Home</Link>
        <Link href="/properties" className="hover:text-blue-600">Properties</Link>
        <Link href="/investors" className="hover:text-blue-600">Investors</Link>
        <Link href="/about" className="hover:text-blue-600">About</Link>
        <Link href="/contact" className="hover:text-blue-600">Contact</Link>
      </nav>
    </header>
  );
}