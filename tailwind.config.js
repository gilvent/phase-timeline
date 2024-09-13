/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "cursor-ripple-in": {
          "0%": { opacity: 0, transform: "scale(1)" },
          "100%": { opacity: 0.66, transform: "scale(1.5)" }
        },
        "cursor-ripple-out": {
          "0%": { opacity: 0.66, transform: "scale(1.5)" },
          "100%": { opacity: 0, transform: "scale(2.5)" }
        }
      }
    }
  },
  plugins: []
};
