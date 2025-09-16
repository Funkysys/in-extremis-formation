import daisyui from "daisyui";
import tailwindcssAnimated from "tailwindcss-animated";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, tailwindcssAnimated],
};
