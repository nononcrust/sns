import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class"],
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
        page: "20px",
      },
      container: {
        center: true,
        screens: {
          "2xl": "600px",
        },
      },
      colors: {
        primary: "var(--primary)",
        "primary-dark": "var(--primary-dark)",
        "primary-light": "var(--primary-light)",
        "primary-lighter": "var(--primary-lighter)",
        ring: "var(--ring)",
        success: "var(--success)",
        "success-light": "var(--success-light)",
        error: "var(--error)",
        "error-light": "var(--error-light)",
        "error-lighter": "var(--error-lighter)",
        main: "var(--main)",
        sub: "var(--sub)",
        subtle: "var(--subtle)",
        border: "var(--border)",
        hover: "var(--hover)",
        content: "var(--content)",
        background: "var(--background)",
        dialog: "var(--dialog)",
        popover: "var(--popover)",
        switch: "var(--switch)",
      },
      keyframes: {
        appear: {
          "0%": { transform: "scale(0)", transformOrigin: "center center" },
          "100%": { transform: "scale(1)", transformOrigin: "center center" },
        },
      },
      animation: {
        appear: "appear 0.3s cubic-bezier(.31,1.76,.72,.76) 1",
      },
    },
  },
  plugins: [animatePlugin, require("tailwind-scrollbar-hide")],
} satisfies Config;

export default config;
