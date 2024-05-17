import defaultConfig from "tailwindcss/defaultConfig";
import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./resources/**/*.blade.php", "./resources/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
      },
      screens: {
        "can-hover": { raw: "(hover:hover)" },
      },
      fontFamily: {
        sans: ["InterVariable", ...defaultConfig.theme.fontFamily.sans],
        display: ["InterDisplay", ...defaultConfig.theme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
