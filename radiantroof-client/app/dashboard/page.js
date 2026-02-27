"use client";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const auth = useAuth();
  const { user, login, logout, loading } = auth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (loading) return <div>Loading...</div>;

  // LOGIN FORM
  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem 3rem",
            borderRadius: "10px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "400px",
            textAlign: "center",
          }}
        >
          <h1 style={{ marginBottom: "1.5rem", color: "#333" }}>Login</h1>
          {error && (
            <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginBottom: "1rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.8rem",
              marginBottom: "1.5rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={async () => {
              try {
                await login(email, password);
                setError("");
              } catch (err) {
                setError("Login failed. Check credentials.");
              }
            }}
            style={{
              width: "100%",
              padding: "0.8rem",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#4338ca")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#4f46e5")
            }
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        background: "#f5f7fa",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "2rem auto",
          background: "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: "1rem", color: "#333" }}>Dashboard</h1>
        <p style={{ marginBottom: "0.5rem" }}>Welcome {user.email}</p>
        <p style={{ marginBottom: "1.5rem" }}>Role: {user.role}</p>
        <button
          onClick={logout}
          style={{
            padding: "0.8rem 1.2rem",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer",
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#dc2626")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#ef4444")}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
