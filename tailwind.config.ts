import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff5f7",
          100: "#ffe4ea",
          200: "#ffc9d6",
          300: "#ff9eb5",
          400: "#ff6b8f",
          500: "#f43f6e",
          600: "#e11d5a",
        },
        warm: {
          50: "#fdf8f6",
          100: "#f9ede8",
          900: "#3d2c2a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
