3️⃣ PostgreSQL Database Project
Folder structure
/database
├─ migrations/         # SQL scripts or migration files
├─ seeds/              # Sample data
├─ schema.sql          # Database schema (tables, relations)
├─ README.md
README.md
# RadiantRoof Database

## Overview
PostgreSQL database for storing users, products, orders, etc.

## Setup
```sql
-- Create the database
CREATE DATABASE radiantroof_db;

-- Create user
CREATE USER radiant_user WITH PASSWORD 'supersecurepassword';
GRANT ALL PRIVILEGES ON DATABASE radiantroof_db TO radiant_user;
Tables

users → id, name, email, password

products → id, name, description, price, stock, image_url

orders → id, user_id, total, status

order_items → id, order_id, product_id, quantity, price

Migrations

All migrations are in migrations/ folder

Apply them with your preferred tool (e.g., Knex.js or TypeORM)


### **Tips**
- Keep **schema.sql** as the source of truth.  
- Use **migration tools** like Knex, TypeORM, or Prisma to track changes.  
- Seed files populate sample data for testing.

---

## **4️⃣ Best Practices for Organizing Docs**
1. **High-level README at the project root** → overview, setup, environment.
2. **Subfolder READMEs for details** → components, backend modules, database.
3. **Automated docs where possible**:
   - Storybook for UI components
   - JSDoc/Swagger for backend API
   - SQL migration scripts for database schema
4. **Keep docs versioned in Git** → every PR updates docs if relevant.
5. **Link everything in root README**:
```markdown
- [Frontend Docs](frontend/README.md)
- [Backend Docs](backend/README.md)
- [Database Docs](database/README.md)