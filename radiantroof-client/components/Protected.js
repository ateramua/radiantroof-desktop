// components/Protected.jsx
"use client";

import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Protected({ children, roles }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // redirect to login if not authenticated
    } else if (roles && !roles.includes(user.role)) {
      router.push("/"); // redirect unauthorized roles to home
    }
  }, [user, router, roles]);

  if (!user || (roles && !roles.includes(user.role))) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return <>{children}</>;
}