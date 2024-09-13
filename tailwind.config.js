/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xs: "340px",
      xs2: "440px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1140px",
    },
    fontFamily: {
      main: ["Montserrat", "sans-serif"],
      inter: ["Inter"],
    },
    extend: {},
  },
  plugins: [],
};
