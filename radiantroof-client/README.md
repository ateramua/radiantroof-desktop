1️⃣ Next.js Frontend UI Project
Folder structure example
/frontend
├─ public/
├─ src/
│  ├─ components/      # Reusable UI components
│  │  ├─ Header/
│  │  │  ├─ Header.tsx
│  │  │  └─ Header.stories.tsx
│  │  └─ ProductCard/
│  ├─ pages/           # Next.js pages
│  ├─ styles/
│  └─ utils/
├─ .env.local          # Environment variables
├─ package.json
├─ README.md
└─ tsconfig.json
README.md (high-level)
# RadiantRoof Frontend

## Project Overview
Next.js UI for RadiantRoof eCommerce platform. Handles routing, components, and rendering.

## Setup
```bash
npm install
npm run dev
Environment Variables

NEXT_PUBLIC_API_URL → Backend API URL

NEXT_PUBLIC_JWT_SECRET → JWT for authentication (if needed in frontend)

Folder Structure

components/ → Reusable UI components

pages/ → Next.js pages

styles/ → Global CSS/SCSS

Documentation

Component-level documentation is in Storybook


### **Component-level docs**
- Use **Storybook**:
```bash
npx sb init
npm run storybook

Each component has a .stories.tsx file describing props, usage, and examples.

This scales automatically as you add new components.