/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0f172a",       // slate-900
        card: "#1f2937",     // gray-800
        primary: "#6366f1",  // indigo-500
      },
      boxShadow: {
        card: "0 4px 18px rgba(0,0,0,.35)",
      },
      borderRadius: {
        xl2: "1rem"
      }
    },
  },
  plugins: [],
};
