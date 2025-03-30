/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "mossy-dark": "#636B2F",
        "mossy-medium": "#BAC095",
        "mossy-light": "#D4DE95",
        "mossy-darkest": "#3D4127",
      },
    },
  },
  plugins: [],
};
