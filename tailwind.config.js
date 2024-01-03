/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "navbar-gray": "#91a3b1",
        "navy-blue": "#011829",
        "sui-blue": "#3898ec",
        "sui-blue-d": "#1F5B7D",
        "sui-blue-h": "#388BFF",
        "sui-gray": "#91a3b1",
        "h-gray": "#f3f4f6",
      },
      borderRadius: {
        "sui-radius": "100px",
      },
      screens: {
        "2xl": "1536px",
        xl: "1280px",
        lg: "1024px",
        md: "768px",
        sm: "640px",
        xs: "480px",
        "2xs": "375px",
      },
    },
  },
  plugins: [],
};
