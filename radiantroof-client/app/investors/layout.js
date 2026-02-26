// app/investors/layout.js
"use client";

import Protected from "../../components/Protected";
import { AuthProvider } from "../../context/AuthContext";
import { AuthProvider } from "../../context/AuthContext";

export default function InvestorsLayout({ children }) {
  return (
    <AuthProvider>
      <Protected roles={["investor"]}>
        <Header></Header>
        {children}
      </Protected>
    </AuthProvider>
  );
}