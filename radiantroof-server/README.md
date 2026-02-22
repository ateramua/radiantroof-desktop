2️⃣ Node.js + Express Backend
Folder structure example
/backend
├─ src/
│  ├─ controllers/
│  ├─ routes/
│  ├─ models/         # Database models
│  ├─ middleware/
│  └─ utils/
├─ .env
├─ package.json
├─ README.md
└─ tsconfig.json
README.md
# RadiantRoof Backend

## Overview
Express API for managing eCommerce data. Handles products, users, orders, and authentication.

## Setup
```bash
npm install
npm run dev
Environment Variables

PORT → Backend server port

DB_HOST, DB_USER, DB_PASS, DB_NAME → PostgreSQL credentials

JWT_SECRET → JWT secret for user authentication

Folder Structure

controllers/ → Request handlers

routes/ → API endpoints

models/ → Database schemas or ORM models

middleware/ → Authentication, logging, validation

utils/ → Helper functions


### **Documentation tips**
- Use **JSDoc** in controllers/models:
```ts
/**
 * Create a new product
 * @param req - Express request object
 * @param res - Express response object
 */
export const createProduct = async (req, res) => {...}

Optionally, generate API docs with Swagger for endpoints:

npm install swagger-jsdoc swagger-ui-express

This allows teammates to see endpoints without reading code.

✅ Next Steps After This
Run migrations to create tables: sequelize.sync()
Connect React frontend to backend:
fetch('/api/houses') or use Axios
Add authentication middleware for protected routes (Dashboard, Users)
Add remaining controllers for Dashboard, Contact, AI features
Test everything with Postman or your frontend