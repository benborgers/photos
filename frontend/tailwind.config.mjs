import defaultConfig from "tailwindcss/defaultConfig";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      fontFamily: {
        sans: ["InterVariable", ...defaultConfig.theme.fontFamily.sans],
        display: ["InterDisplay", ...defaultConfig.theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
