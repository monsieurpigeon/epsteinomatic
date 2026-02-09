/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#0f0f12",
        surface: "#1a1a20",
        border: "#2d2d36",
        muted: "#8888a0",
        accent: {
          DEFAULT: "#6c5ce7",
          hover: "#7d6ef7",
        },
        // Island / beach palette
        ocean: {
          DEFAULT: "#0e7490",
          light: "#06b6d4",
          dark: "#0c4a6e",
          blue: "#0284c7",
          deep: "#0369a1",
        },
        sand: {
          DEFAULT: "#e8d5b7",
          dark: "#d4a574",
          light: "#f5e6d3",
          ink: "#6b5344",
        },
        palm: { DEFAULT: "#166534", light: "#22c55e", dark: "#14532d" },
        sky: "#7dd3fc",
        coral: "#f97316",
        tropical: "#14b8a6",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      borderRadius: {
        box: "12px",
      },
    },
  },
  plugins: [],
};
