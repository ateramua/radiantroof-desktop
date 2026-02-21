Below is a clear, production-style setup guide to build a full-stack eCommerce app using:

Frontend: Next.js

Backend: Express

Runtime: Node.js

Database: PostgreSQL

We’ll build:

ecommerce-app/
   client/   → Next.js frontend
   server/   → Express API
   database/ → PostgreSQL
🧱 PART 1 — Install Required Software
1️⃣ Install Node.js

Download LTS from:
https://nodejs.org

Verify:

node -v
npm -v
2️⃣ Install PostgreSQL

Download from:
https://www.postgresql.org/download/

After install:

psql --version

Start PostgreSQL service if needed.

🗄 PART 2 — Set Up PostgreSQL Database
1️⃣ Open psql
psql postgres
2️⃣ Create Database
CREATE DATABASE ecommerce_db;
\c ecommerce_db;
3️⃣ Create Basic Tables
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  price NUMERIC(10,2),
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  total NUMERIC(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Exit:

\q
🖥 PART 3 — Build Backend (Express API)
1️⃣ Create Backend Folder
mkdir server
cd server
npm init -y
2️⃣ Install Dependencies
npm install express pg cors dotenv bcrypt jsonwebtoken
npm install nodemon --save-dev
3️⃣ Project Structure
server/
   server.js
   .env
4️⃣ Create .env
PORT=5000
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/ecommerce_db
JWT_SECRET=supersecretkey
5️⃣ Create server.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test Route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Get Products
app.get("/products", async (req, res) => {
  const products = await pool.query("SELECT * FROM products");
  res.json(products.rows);
});

// Add Product
app.post("/products", async (req, res) => {
  const { name, description, price, image_url } = req.body;
  const newProduct = await pool.query(
    "INSERT INTO products (name, description, price, image_url) VALUES ($1,$2,$3,$4) RETURNING *",
    [name, description, price, image_url]
  );
  res.json(newProduct.rows[0]);
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
6️⃣ Add Script

In package.json:

"scripts": {
  "dev": "nodemon server.js"
}

Run backend:

npm run dev

Your API runs at:

http://localhost:5000
🎨 PART 4 — Create Frontend (Next.js)
1️⃣ Create Next App

From root folder:

npx create-next-app@latest client
cd client

Choose:

TypeScript (optional)

App Router (recommended)

ESLint (yes)

2️⃣ Install Axios
npm install axios
🔗 PART 5 — Connect Frontend to Backend
1️⃣ Create API Utility

client/lib/api.js

import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export default API;
2️⃣ Fetch Products in Homepage

app/page.js

"use client";
import { useEffect, useState } from "react";
import API from "../lib/api";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get("/products").then(res => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>${product.price}</p>
        </div>
      ))}
    </div>
  );
}
3️⃣ Run Frontend
npm run dev

Frontend runs at:

http://localhost:3000
🔐 PART 6 — Add Authentication (Basic Setup)

In backend:

Hash passwords using bcrypt

Generate JWT using jsonwebtoken

Protect routes with middleware

Basic example:

const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
}
🛒 PART 7 — eCommerce Features to Add
Core Features:

User Registration/Login

Product Listing

Product Details Page

Shopping Cart (client state or DB)

Order Creation

Payment Integration (Stripe)

🚀 Production Deployment Plan

Frontend:

Deploy Next.js to Vercel

Backend:

Deploy Express to Render / Railway

Database:

Use hosted PostgreSQL (Supabase / Neon)

🧠 Architecture Overview
Next.js (UI)
     ↓ HTTP (Axios)
Express API (Node.js)
     ↓ SQL (pg)
PostgreSQL Database
🔥 Recommended Folder Structure (Clean Version)
ecommerce-app/
   client/
   server/
   README.md
🎯 Final Checklist

✔ Node.js installed
✔ PostgreSQL running
✔ Database created
✔ Express API connected to DB
✔ Next.js fetching API
✔ CORS enabled
✔ Environment variables configured