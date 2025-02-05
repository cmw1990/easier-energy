import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "float-up": {
          "0%": { transform: "translate(-50%, -50%) scale(1)" },
          "50%": { transform: "translate(-50%, -80%) scale(1.5)" },
          "100%": { transform: "translate(-50%, -50%) scale(1.3)" }
        },
        "float-down": {
          "0%": { transform: "translate(-50%, -50%) scale(1.3)" },
          "100%": { transform: "translate(-50%, -50%) scale(1)" }
        },
        "sway": {
          "0%, 100%": { transform: "translate(-50%, -50%) rotate(-5deg)" },
          "50%": { transform: "translate(-50%, -50%) rotate(5deg)" }
        }
      },
      animation: {
        "float-up": "float-up 4s ease-in-out",
        "float-down": "float-down 4s ease-in-out",
        "sway": "sway 3s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;