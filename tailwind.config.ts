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
          "0%": { transform: "translateY(0) scale(1)" },
          "50%": { transform: "translateY(-20px) scale(1.5)" },
          "100%": { transform: "translateY(0) scale(1.3)" }
        },
        "float-down": {
          "0%": { transform: "translateY(-20px) scale(1.3)" },
          "100%": { transform: "translateY(0) scale(1)" }
        },
        "sway": {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" }
        },
        "swim": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-400%)" }
        },
        "rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-100px) scale(0)", opacity: "0" }
        }
      },
      animation: {
        "float-up": "float-up 4s ease-in-out",
        "float-down": "float-down 4s ease-in-out",
        "sway": "sway 3s ease-in-out infinite",
        "swim": "swim 10s linear infinite",
        "rise": "rise 2s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;