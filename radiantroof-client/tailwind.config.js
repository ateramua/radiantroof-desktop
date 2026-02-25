/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // all app directory components and pages
    "./pages/**/*.{js,ts,jsx,tsx}", // optional if you use pages/
    "./components/**/*.{js,ts,jsx,tsx}" // reusable components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}