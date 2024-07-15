import type { Config } from "tailwindcss";
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
      container: {
        center: true,
        padding: "16px",
        screens: {
          "2xl": "1200px",
        },
      },
      colors: {
        primary: colors.blue[500],
        "primary-dark": colors.blue[600],
        "primary-light": colors.blue[400],
        "primary-lighter": colors.blue[200],
        ring: colors.blue[400],
        success: colors.green[500],
        "success-light": colors.green[400],
        error: colors.red[500],
        "error-light": colors.red[400],
        "error-lighter": colors.red[200],
        main: colors.gray[900],
        sub: colors.gray[500],
        divider: colors.gray[300],
        border: colors.gray[300],
        content: colors.gray[100],
      },
    },
  },
  plugins: [],
};
export default config;
