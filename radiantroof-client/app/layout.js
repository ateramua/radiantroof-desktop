// Electron renderer polyfill - MUST BE FIRST to fix "global is not defined"
import "../lib/electron-polyfill";

import Header from "@/components/Header";
import { AuthProvider } from "../context/AuthContext";
import { DealProvider } from "../context/DealContext";
import ApiInitializer from "../components/ApiInitializer";
import "./globals.css";

export const metadata = {
  title: "Radiant Roof Realty",
  description: "Premium real estate investment platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <DealProvider>
            <ApiInitializer />
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </DealProvider>
        </AuthProvider>
      </body>
    </html>
  );
}