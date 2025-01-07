import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Courier Prime", "Courier New", "monospace"],
      },
      colors: {
        gray: colors.stone,
      },
    },
  },
  plugins: [],
};
