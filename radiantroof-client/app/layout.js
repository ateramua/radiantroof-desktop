import Header from "@/components/Header";
import { AuthProvider } from "../context/AuthContext";
import { DealProvider } from "../context/DealContext";  // ADD THIS IMPORT
import ApiInitializer from "../components/ApiInitializer";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen flex flex-col">
        <AuthProvider>
          <DealProvider>  {/* ADD THIS WRAPPER */}
            <ApiInitializer />
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </DealProvider>  {/* CLOSE THE WRAPPER */}
        </AuthProvider>
      </body>
    </html>
  );
}