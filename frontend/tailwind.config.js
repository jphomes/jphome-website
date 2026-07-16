/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e4a3b",
        secondary: "#2e7d5a",
        mint: "#e8f5e9",
        warm: "#f4f1ea",
        sand: "#e8e2d9",
        gold: "#c2a875",
        ink: "#1a1a1a",
        muted: "#4a4a4a",
        light: "#7a7a7a",
        cream: "#fafcfb",
        sage: "#d4e8da",
        forest: "#1e4a3b",
        leaf: "#2e7d5a",
        paper: "#fafcfb",
        stone: "#f4f1ea",
        brass: "#c2a875",
      },
      fontFamily: {
        display: ["Playfair Display", "DM Serif Display", "serif"],
        body: ["Inter", "Poppins", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        card: "14px",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(30, 74, 59, 0.08)",
        card: "0 2px 16px rgba(30, 74, 59, 0.06)",
      },
    },
  },
  plugins: [],
};
