/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        xu: {
          blue: "#0C2340", // Pantone 289
          blueLight: "#163a66",
          silver: "#9EA2A2", // Pantone 422
          bg: "#f4f5f7",
          white: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
