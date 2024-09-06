import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)", ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        page: "24px",
      },
      container: {
        center: true,
        screens: {
          "2xl": "600px",
        },
      },
      colors: {
        primary: colors.black,
        "primary-dark": colors.black,
        "primary-light": colors.gray[900],
        "primary-lighter": colors.gray[300],
        ring: colors.gray[400],
        success: colors.green[500],
        "success-light": colors.green[400],
        error: colors.red[500],
        "error-light": colors.red[400],
        "error-lighter": colors.red[200],
        main: colors.gray[800],
        sub: colors.gray[500],
        subtle: colors.gray[400],
        divider: colors.gray[200],
        border: colors.gray[200],
        content: colors.gray[50],
      },
    },
  },
  plugins: [animatePlugin],
};
export default config;
